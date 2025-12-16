import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
try {
        // Check if MONGO_URL is defined
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not defined in environment variables. Please create a .env file with MONGO_URL");
        }

        // Validate MONGO_URL format
        const mongoUrl = process.env.MONGO_URL.trim();
        if (!mongoUrl.startsWith('mongodb://') && !mongoUrl.startsWith('mongodb+srv://')) {
            throw new Error("Invalid MONGO_URL format. Must start with 'mongodb://' or 'mongodb+srv://'");
        }

        // MongoDB connection options for better reliability
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain at least 5 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
            retryWrites: true,
            w: 'majority'
        };

        console.log("🔄 Connecting to MongoDB...");
        const conn = await mongoose.connect(mongoUrl, options);
        
        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected successfully');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

} catch (error) {
        console.error("\n❌ MongoDB Connection Failed!");
        console.error(`   Error: ${error.message}`);
        
        // Provide specific error messages based on error type
        if (error.message.includes('authentication failed')) {
            console.error("\n💡 Authentication Error:");
            console.error("   - Check your MongoDB username and password");
            console.error("   - Verify credentials in MongoDB Atlas dashboard");
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            console.error("\n💡 Network/DNS Error:");
            console.error("   - Check your internet connection");
            console.error("   - Verify MongoDB Atlas cluster URL is correct");
            console.error("   - Check if MongoDB Atlas IP whitelist allows your IP");
        } else if (error.message.includes('timeout')) {
            console.error("\n💡 Connection Timeout:");
            console.error("   - Check your network connection");
            console.error("   - Verify MongoDB Atlas is accessible");
            console.error("   - Check firewall settings");
        } else {
            console.error("\n💡 Common Issues:");
            console.error("   1. Make sure MongoDB is running (if using local MongoDB)");
            console.error("   2. Check your .env file has MONGO_URL set correctly");
            console.error("   3. For local MongoDB: mongodb://localhost:27017/bus-tracking");
            console.error("   4. For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/bus-tracking");
            console.error("   5. Verify MongoDB Atlas Network Access (IP Whitelist)");
            console.error("   6. Check MongoDB Atlas Database User permissions");
        }
        
        console.error("\n📝 Your MONGO_URL format:");
        const url = process.env.MONGO_URL || 'Not set';
        const maskedUrl = url.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
        console.error(`   ${maskedUrl}\n`);
    
        process.exit(1); // Exit process if database connection fails
}
};

export default connectDB;
