import express from "express";
import Booking from "../Models/Booking.js";
import Ticket from "../Models/Ticket.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user bookings
router.get("/my-bookings", authenticateToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('bus', 'busNumber busName')
            .populate('route', 'routeNumber routeName')
            .sort({ bookingDate: -1 });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error("Get bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings"
        });
    }
});

// Get booking by ID
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id
        })
        .populate('bus', 'busNumber busName')
        .populate('route', 'routeNumber routeName stops');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Get ticket information
        const ticket = await Ticket.findOne({ booking: booking._id });

        res.json({
            success: true,
            data: {
                booking,
                ticket
            }
        });
    } catch (error) {
        console.error("Get booking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch booking"
        });
    }
});

// Cancel booking
router.put("/:id/cancel", authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking already cancelled"
            });
        }

        if (booking.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel completed booking"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        res.json({
            success: true,
            message: "Booking cancelled successfully"
        });
    } catch (error) {
        console.error("Cancel booking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel booking"
        });
    }
});

// Verify ticket
router.post("/verify-ticket", async (req, res) => {
    try {
        const { ticketNumber } = req.body;

        const ticket = await Ticket.findOne({ ticketNumber })
            .populate({
                path: 'booking',
                populate: [
                    { path: 'user', select: 'username email' },
                    { path: 'bus', select: 'busNumber busName' },
                    { path: 'route', select: 'routeNumber routeName' }
                ]
            });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        if (ticket.isUsed) {
            return res.status(400).json({
                success: false,
                message: "Ticket already used",
                usedAt: ticket.usedAt
            });
        }

        res.json({
            success: true,
            message: "Ticket is valid",
            data: {
                ticket,
                booking: ticket.booking
            }
        });
    } catch (error) {
        console.error("Verify ticket error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify ticket"
        });
    }
});

export default router;
