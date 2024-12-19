import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const mongoURI =
  process.env.VITE_REACT_MONGO_URI ||
  "mongodb+srv://root:root@maincluster.xencs.mongodb.net/mixbunch";

export const db = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to MongoDB.");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from MongoDB.");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection closed on app termination.");
      process.exit(0);
    });

    console.log("MongoDB connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error.message);
  }
};

export default mongoose;
