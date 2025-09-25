import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {

try {
await mongoose.connect (process.env.MONGO_URL )
    console.log("mongodb Connected")

} catch (error) {
    console.log("error is found", error);
    
}
 }
 export default connectDB
