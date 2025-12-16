import mongoose from "mongoose"
 
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // Optional to support Google accounts
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // allow null/undefined without violating uniqueness
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    profilePicture: {
        type: String
    }
}, { timestamps: true });

// Enforce password only for local accounts
UserSchema.pre("save", function (next) {
    if (this.authProvider === "local" && !this.password) {
        return next(new Error("Password is required for local accounts"));
    }
    return next();
});

const User = mongoose.model("User", UserSchema)
export default User 