import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Booking from "../Models/Booking.js";
import Payment from "../Models/Payment.js";
import Ticket from "../Models/Ticket.js";
import Bus from "../Models/Bus.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

// Ensure environment variables are loaded
dotenv.config();

const router = express.Router();

// Initialize Razorpay (lazy initialization)
let razorpay = null;

const getRazorpayInstance = () => {
    if (!razorpay) {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        
        if (!keyId || !keySecret) {
            throw new Error('Razorpay keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file');
        }
        
        razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    }
    return razorpay;
};

// Create payment order
router.post("/create-order", authenticateToken, async (req, res) => {
    try {
        const {
            busId,
            fromStop,
            toStop,
            travelDate,
            seatNumber,
            fare
        } = req.body;

        // Verify bus exists
        const bus = await Bus.findById(busId).populate('route');
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found"
            });
        }

        // Check if seat is already booked for the same date
        const existingBooking = await Booking.findOne({
            bus: busId,
            travelDate: new Date(travelDate),
            seatNumber,
            status: { $in: ["pending", "confirmed"] }
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "Seat already booked for this date"
            });
        }

        // Create pending booking
        const booking = new Booking({
            user: req.user._id,
            bus: busId,
            route: bus.route._id,
            fromStop,
            toStop,
            travelDate: new Date(travelDate),
            seatNumber,
            fare,
            status: "pending"
        });

        await booking.save();

        // Validate fare amount (Razorpay minimum is ₹1 = 100 paise)
        if (!fare || fare < 1) {
            // Delete the booking if fare is invalid
            await Booking.findByIdAndDelete(booking._id);
            return res.status(400).json({
                success: false,
                message: "Invalid fare amount. Minimum fare is ₹1"
            });
        }

        // Create Razorpay order
        const amountInPaise = Math.round(fare * 100); // Convert to paise and round
        
        const options = {
            amount: amountInPaise, // Amount in paise
            currency: "INR",
            receipt: `booking_${booking._id}`,
            notes: {
                bookingId: booking._id.toString(),
                userId: req.user._id.toString(),
                busId: busId,
                seatNumber: seatNumber,
                travelDate: travelDate
            }
        };

        let order;
        try {
            const razorpayInstance = getRazorpayInstance();
            order = await razorpayInstance.orders.create(options);
        } catch (razorpayError) {
            // Delete the booking if Razorpay order creation fails
            await Booking.findByIdAndDelete(booking._id);
            console.error("Razorpay order creation error:", razorpayError);
            return res.status(500).json({
                success: false,
                message: razorpayError.error?.description || "Failed to create payment order with Razorpay",
                error: process.env.NODE_ENV === "development" ? razorpayError.message : undefined
            });
        }

        // Create payment record
        const payment = new Payment({
            booking: booking._id,
            amount: fare,
            currency: "INR",
            status: "pending",
            provider: "razorpay",
            txnId: order.id
        });

        await payment.save();

        // Link payment to booking
        booking.payment = payment._id;
        await booking.save();

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            bookingId: booking._id,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Create order error:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Failed to create payment order",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});

// Verify payment and confirm booking
router.post("/verify-payment", authenticateToken, async (req, res) => {
    try {
        const { orderId, paymentId, signature, bookingId } = req.body;

        // Verify payment signature
        const text = `${orderId}|${paymentId}`;
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');

        if (generatedSignature !== signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Find booking
        const booking = await Booking.findOne({
            _id: bookingId,
            user: req.user._id
        }).populate('payment');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Update payment status
        if (booking.payment) {
            booking.payment.status = "paid";
            booking.payment.txnId = paymentId;
            booking.payment.paidAt = new Date();
            await booking.payment.save();
        }

        // Confirm booking
        booking.status = "confirmed";
        await booking.save();

        // Generate ticket
        const ticketNumber = `TKT${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const ticket = new Ticket({
            booking: booking._id,
            ticketNumber
        });
        await ticket.save();

        // Populate booking with related data
        const populatedBooking = await Booking.findById(booking._id)
            .populate('bus', 'busNumber busName')
            .populate('route', 'routeNumber routeName')
            .populate('payment');

        res.json({
            success: true,
            message: "Payment successful and booking confirmed",
            data: {
                booking: populatedBooking,
                ticket: {
                    ticketNumber
                }
            }
        });
    } catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify payment"
        });
    }
});

// Payment failed - cancel booking
router.post("/payment-failed", authenticateToken, async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findOne({
            _id: bookingId,
            user: req.user._id
        }).populate('payment');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Update payment status
        if (booking.payment) {
            booking.payment.status = "failed";
            await booking.payment.save();
        }

        // Cancel booking
        booking.status = "cancelled";
        await booking.save();

        res.json({
            success: true,
            message: "Booking cancelled due to payment failure"
        });
    } catch (error) {
        console.error("Payment failed error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process payment failure"
        });
    }
});

export default router;

