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

// Configure CORS
app.use(
  cors({
    origin: "https://flunt-fit-v1-client.vercel.app", // Replace with your frontend URL
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
app.use(limiter);

// Define a root route to display "hello"
app.get("/", (req, res) => {
  res.send("hello");
});

// Define routes
app.use("/v1/users", userRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/products", productRouter);

// Sync Sequelize models
const prepareServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Call the function to prepare the server
prepareServer();

// Bind to a port
const PORT = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
