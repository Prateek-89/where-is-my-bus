import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../Models/userModels.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const getAllowedClientOrigins = () => {
    const raw = process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173";
    return raw.split(",").map((origin) => origin.trim()).filter(Boolean);
};

const getFrontendGoogleRedirect = () => {
    if (process.env.GOOGLE_CLIENT_REDIRECT) {
        return process.env.GOOGLE_CLIENT_REDIRECT.trim();
    }
    const [firstOrigin] = getAllowedClientOrigins();
    return `${firstOrigin}/google-callback`;
};

const ensureGoogleOAuthConfig = () => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
        throw new Error("Google OAuth environment variables are not fully configured");
    }
};

const getOAuthClient = () => {
    ensureGoogleOAuthConfig();
    return new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
};

const generateUserToken = (userId) => jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);

const findOrCreateGoogleUser = async ({ googleId, email, name, picture }) => {
    if (!email) {
        throw new Error("Email not provided by Google");
    }

    let user = await User.findOne({
        $or: [{ email }, { googleId }]
    });

    if (user) {
        if (!user.googleId) {
            user.googleId = googleId;
            user.authProvider = "google";
        }
        if (picture) {
            user.profilePicture = picture;
        }
        if (!user.username && name) {
            user.username = name.toLowerCase().replace(/\s+/g, "") + Math.random().toString(36).substring(2, 6);
        }
        await user.save();
        return user;
    }

    const username = name
        ? name.toLowerCase().replace(/\s+/g, "") + Math.random().toString(36).substring(2, 6)
        : email.split("@")[0];

    user = new User({
        email,
        googleId,
        username,
        authProvider: "google",
        profilePicture: picture
    });

    await user.save();
    return user;
};

// Register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email or username already exists"
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT token
        const token = generateUserToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        // Check if user has password (not Google-only account)
        if (!user.password) {
            return res.status(401).json({ 
                success: false,
                message: "This account uses Google Sign-In. Please sign in with Google."
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        // Generate JWT token
        const token = generateUserToken(user._id);

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
});

// Google OAuth Login
router.post("/google", async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: "Google ID token is required"
            });
        }

        // Verify Google ID token
        if (!process.env.GOOGLE_CLIENT_ID) {
            console.error("GOOGLE_CLIENT_ID is not set in environment variables");
            return res.status(500).json({
                success: false,
                message: "Google OAuth is not configured on the server"
            });
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let ticket;
        
        try {
            ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
        } catch (error) {
            console.error("Google token verification error:", error);
            console.error("Error details:", error.message);
            
            // Provide more specific error messages
            let errorMessage = "Invalid Google token";
            if (error.message?.includes("audience")) {
                errorMessage = "Token audience mismatch. Check Google Client ID configuration.";
            } else if (error.message?.includes("expired")) {
                errorMessage = "Google token has expired. Please try again.";
            } else if (error.message?.includes("signature")) {
                errorMessage = "Invalid token signature. Origin may not be authorized in Google Cloud Console.";
            }
            
            return res.status(401).json({
                success: false,
                message: errorMessage,
                error: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        const user = await findOrCreateGoogleUser({ googleId, email, name, picture });

        // Generate JWT token
        const token = generateUserToken(user._id);

        res.json({
            success: true,
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process Google login",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});

// Google OAuth (redirect-based) start
router.get("/google/start", async (req, res) => {
    try {
        const client = getOAuthClient();
        const scopes = ["openid", "email", "profile"];

        const authorizationUrl = client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: scopes,
            state: req.query.state || ""
        });

        return res.redirect(authorizationUrl);
    } catch (error) {
        console.error("Google OAuth start error:", error);
        return res.status(500).json({
            success: false,
            message: "Google OAuth is not configured correctly on the server."
        });
    }
});

// Google OAuth callback
router.get("/google/callback", async (req, res) => {
    const frontendRedirect = getFrontendGoogleRedirect();

    const redirectWithMessage = (params) => {
        const redirectUrl = new URL(frontendRedirect);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                redirectUrl.searchParams.set(key, value);
            }
        });
        return res.redirect(redirectUrl.toString());
    };

    if (req.query.error) {
        return redirectWithMessage({ error: req.query.error });
    }

    const { code } = req.query;
    if (!code) {
        return redirectWithMessage({ error: "missing_code" });
    }

    try {
        const client = getOAuthClient();
        const { tokens } = await client.getToken(code);

        if (!tokens?.id_token) {
            return redirectWithMessage({ error: "missing_id_token" });
        }

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        const user = await findOrCreateGoogleUser({ googleId, email, name, picture });
        const token = generateUserToken(user._id);

        return redirectWithMessage({ token, status: "success" });
    } catch (error) {
        console.error("Google OAuth callback error:", error);
        return redirectWithMessage({ error: "google_callback_failed" });
    }
});

// Logout (client-side token removal)
router.post("/logout", authenticateToken, (req, res) => {
    res.json({ 
        success: true,
        message: "Logged out successfully" 
    });
});

// Get current user
router.get("/me", authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            profilePicture: req.user.profilePicture
        }
    });
});

export default router;
