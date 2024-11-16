import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sequelize from "./config/config.js"; // Ensure DB connection credentials are production-ready
import userRoutes from "./Routes/userRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import productRouter from "./Routes/productRoutes.js";

// Initialize Express app
const app = express();

// Configure CORS to allow your frontend domain
app.use(
  cors({
    origin:
      "https://flunt-fit-v1-client.vercel.app/" ||
      "https://flunt-fit-v1-client.vercel.app", // Replace "*" with your frontend URL for production
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // If cookies or tokens are used
  })
);

// Security headers
app.use(helmet());

// Body parser middleware
app.use(bodyParser.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Define routes
app.use("/v1/users", userRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/products", productRouter);

// Sync Sequelize models and prepare for serverless deployment
const prepareServer = async () => {
  try {
    // Ensure database credentials are loaded from environment variables
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Call the function to prepare the server  
prepareServer();

// Export the app for Vercel's serverless environment
export default app;
