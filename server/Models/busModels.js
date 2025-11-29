import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: true,
        unique: true
    },
    busName: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    currentLocation: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: true
    },
    driver: {
        name: String,
        phone: String
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const RouteSchema = new mongoose.Schema({
    routeNumber: {
        type: String,
        required: true,
        unique: true
    },
    routeName: {
        type: String,
        required: true
    },
    startPoint: {
        name: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    endPoint: {
        name: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    stops: [{
        name: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        estimatedTime: Number // in minutes from start
    }],
    totalDistance: {
        type: Number,
        required: true
    },
    estimatedDuration: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Bus = mongoose.model("Bus", BusSchema);
const Route = mongoose.model("Route", RouteSchema);

export { Bus, Route };
