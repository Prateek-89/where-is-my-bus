import mongoose from "mongoose";
import dotenv from "dotenv";
import Bus from "../Models/Bus.js";
import Route from "../Models/Route.js";
import connectDB from "../utils/db.js";

dotenv.config();

const sampleRoutes = [
    {
        routeNumber: "R001",
        routeName: "Downtown to Airport",
        startPoint: {
            name: "Downtown Central",
            coordinates: { latitude: 40.7128, longitude: -74.0060 }
        },
        endPoint: {
            name: "City Airport",
            coordinates: { latitude: 40.6892, longitude: -74.1745 }
        },
        stops: [
            {
                name: "Central Station",
                coordinates: { latitude: 40.7128, longitude: -74.0060 },
                estimatedTime: 0
            },
            {
                name: "University District",
                coordinates: { latitude: 40.7589, longitude: -73.9851 },
                estimatedTime: 15
            },
            {
                name: "Business Park",
                coordinates: { latitude: 40.7505, longitude: -73.9934 },
                estimatedTime: 30
            },
            {
                name: "Airport Terminal",
                coordinates: { latitude: 40.6892, longitude: -74.1745 },
                estimatedTime: 45
            }
        ],
        totalDistance: 25.5,
        estimatedDuration: 45,
        isActive: true
    },
    {
        routeNumber: "R002",
        routeName: "North to South Express",
        startPoint: {
            name: "North Terminal",
            coordinates: { latitude: 40.8176, longitude: -73.9782 }
        },
        endPoint: {
            name: "South Station",
            coordinates: { latitude: 40.6892, longitude: -74.0445 }
        },
        stops: [
            {
                name: "North Terminal",
                coordinates: { latitude: 40.8176, longitude: -73.9782 },
                estimatedTime: 0
            },
            {
                name: "Midtown Plaza",
                coordinates: { latitude: 40.7589, longitude: -73.9851 },
                estimatedTime: 20
            },
            {
                name: "South Station",
                coordinates: { latitude: 40.6892, longitude: -74.0445 },
                estimatedTime: 40
            }
        ],
        totalDistance: 18.2,
        estimatedDuration: 40,
        isActive: true
    }
];

const sampleBuses = [
    {
        busNumber: "B001",
        busName: "City Express 1",
        capacity: 50,
        currentLocation: {
            latitude: 40.7128,
            longitude: -74.0060
        },
        isActive: true
    },
    {
        busNumber: "B002",
        busName: "City Express 2",
        capacity: 45,
        currentLocation: {
            latitude: 40.7589,
            longitude: -73.9851
        },
        isActive: true
    },
    {
        busNumber: "B003",
        busName: "North-South Express",
        capacity: 40,
        currentLocation: {
            latitude: 40.8176,
            longitude: -73.9782
        },
        isActive: true
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        
        // Clear existing data
        await Route.deleteMany({});
        await Bus.deleteMany({});
        
        console.log("Cleared existing data");
        
        // Create routes
        const createdRoutes = await Route.insertMany(sampleRoutes);
        console.log(`Created ${createdRoutes.length} routes`);
        
        // Create buses with route references
        const busesWithRoutes = sampleBuses.map((bus, index) => ({
            ...bus,
            route: createdRoutes[index % createdRoutes.length]._id
        }));
        
        const createdBuses = await Bus.insertMany(busesWithRoutes);
        console.log(`Created ${createdBuses.length} buses`);
        
        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase();
}

export default seedDatabase;
