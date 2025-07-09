import mongoose from "mongoose";

const connectDB = async ()=>{ 
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to mongodb");
    } catch (error) {
        console.log("Error in mongodb connection",error);
    }
}

export default connectDB;