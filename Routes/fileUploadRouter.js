// routes/uploadRoutes.js
import express from "express";
import uploadFile from "../controllers/fileUploadController.js";

const fileUploadRouter = express.Router();

// Route to handle file uploads
fileUploadRouter.post("/", uploadFile);

export default fileUploadRouter;
