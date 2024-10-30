import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sequelize from "./config/config.js";
import userRoutes from "./Routes/userRoutes.js";
import authRoutes from "./Routes/authRoutes.js";

import productRouter from "./Routes/productRoutes.js"; 
const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Corrected route paths with leading slashes
app.use("/v1/users", userRoutes);
app.use("/v1/auth", authRoutes); 
app.use("/v1/products", productRouter); 

startServer();
