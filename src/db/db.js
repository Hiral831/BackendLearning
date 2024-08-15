import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";


const connectDB = async () => {
    try {
        // Construct the connection string
        const mongoUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        
        // Connect to MongoDB
        const connectionInstance = await mongoose.connect(mongoUri);

        // Log success message
        console.log(`\nConnected to the MongoDB database!!  DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        // Log error message and exit
        console.error("ERROR: ", error);
        process.exit(1); // Exit the process with failure code
    }
};

export default connectDB;