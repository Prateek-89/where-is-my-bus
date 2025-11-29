import express from "express";
import Bus from "../Models/Bus.js";
import Route from "../Models/Route.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all routes
router.get("/routes", async (req, res) => {
    try {
        const routes = await Route.find({ isActive: true })
            .select('-__v')
            .sort({ routeName: 1 });
        
        res.json({
            success: true,
            data: routes
        });
    } catch (error) {
        console.error("Get routes error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch routes"
        });
    }
});

// Get route by ID
router.get("/routes/:id", async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        
        if (!route) {
            return res.status(404).json({
                success: false,
                message: "Route not found"
            });
        }
        
        res.json({
            success: true,
            data: route
        });
    } catch (error) {
        console.error("Get route error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch route"
        });
    }
});

// Get all buses
router.get("/buses", optionalAuth, async (req, res) => {
    try {
        const buses = await Bus.find({ isActive: true })
            .populate('route', 'routeNumber routeName startPoint endPoint')
            .select('-__v')
            .sort({ busNumber: 1 });
        
        res.json({
            success: true,
            data: buses
        });
    } catch (error) {
        console.error("Get buses error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch buses"
        });
    }
});

// Get buses by route
router.get("/buses/route/:routeId", optionalAuth, async (req, res) => {
    try {
        const buses = await Bus.find({ 
            route: req.params.routeId,
            isActive: true 
        })
        .populate('route', 'routeNumber routeName startPoint endPoint')
        .select('-__v');
        
        res.json({
            success: true,
            data: buses
        });
    } catch (error) {
        console.error("Get buses by route error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch buses for route"
        });
    }
});

// Track specific bus
router.get("/buses/:id/track", optionalAuth, async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id)
            .populate('route', 'routeNumber routeName stops');
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found"
            });
        }
        
        res.json({
            success: true,
            data: {
                busId: bus._id,
                busNumber: bus.busNumber,
                busName: bus.busName,
                currentLocation: bus.currentLocation,
                lastUpdated: bus.lastUpdated,
                route: bus.route,
                isActive: bus.isActive
            }
        });
    } catch (error) {
        console.error("Track bus error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to track bus"
        });
    }
});

// Get bus by ID
router.get("/buses/:id", optionalAuth, async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id)
            .populate('route', 'routeNumber routeName startPoint endPoint stops');
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found"
            });
        }
        
        res.json({
            success: true,
            data: bus
        });
    } catch (error) {
        console.error("Get bus error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bus"
        });
    }
});

export default router;
