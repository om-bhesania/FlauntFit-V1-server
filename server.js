import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { db as connectToMongoDB } from "./config/config.js"; // MongoDB connection setup
import userRoutes from "./Routes/userRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import productRouter from "./Routes/productRoutes.js";
import fileUploadRouter from "./Routes/fileUploadRouter.js";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import customerRouter from "./Routes/customerRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Define allowed origins based on environment
const allowedOrigins = [
  "http://localhost:5173", // Development URL
  "https://mixbunch-dev.netlify.app", // Production URL
];

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],

    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// Security headers
app.use(helmet());

// Body parser middleware
app.use(bodyParser.json({ limit: "40mb" })); // Allows up to 40MB payloads
app.use(bodyParser.urlencoded({ limit: "40mb", extended: true }));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Define a root route to display "hello"
app.get("/", (req, res) => {
  res.send(`Mix Bunch BackEnd`);
});

// Define routes
app.use("/v1/users", userRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/products", productRouter);
app.use(fileUpload()); // This line should be placed before your upload route
app.use("/v1/upload", fileUploadRouter);
app.use("/v1/customers", customerRouter);

// swagger config
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swaggerConfig.js";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Connect to MongoDB
const prepareServer = async () => {
  try {
    await connectToMongoDB(); // Connect to MongoDB using Mongoose
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit the application if database connection fails
  }
};

// Call the function to prepare the server
prepareServer();

// Bind to a port
const PORT = process.env.PORT || 3012; // Use the PORT environment variable or default to 3012
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
