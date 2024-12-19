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

// Initialize Express app
const app = express();

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Security headers
app.use(helmet());

// Body parser middleware
app.use(bodyParser.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
// Increase the payload limit for large base64-encoded images
app.use(bodyParser.json({ limit: "40mb" })); // Allows up to 10MB payloads
app.use(bodyParser.urlencoded({ limit: "40mb", extended: true }));
app.use(limiter);

// Define a root route to display "hello"
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Flunt Fit API</title>
    </head>
    <body>
      <div>
        <h1>Flunt Fit API Endpoints</h1>
        <ul>
          <li>Users: "/v1/users"</li>
          <li>Auth: "/v1/auth"</li>
          <li>Products: "/v1/products"</li>
          <li>File Upload: "/v1/upload"</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

// Define routes
app.use("/v1/users", userRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/products", productRouter);
app.use(fileUpload()); // This line should be placed before your upload route
app.use("/v1/upload", fileUploadRouter);

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
