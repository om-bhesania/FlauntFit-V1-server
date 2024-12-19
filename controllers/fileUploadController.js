import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";

dotenv.config();

const app = express();
app.use(express.json());
app.use(fileUpload()); // Middleware for handling file uploads

// Mongoose schema and model for storing file metadata
const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  contentType: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});
const File = mongoose.model("File", fileSchema);

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID || "865426e7f41e850"; // Imgur Client ID

const uploadFiles = async (req, res) => {
  try {
    const file = req.files?.file; // Get the uploaded file

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Use the form-data package
    const formData = new FormData();
    formData.append("image", file.data); // Use file data directly

    const imgurResponse = await axios.post(
      "https://api.imgur.com/3/upload",
      formData,
      {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,  
        },
      }
    );

    if (imgurResponse.data.success) {
      const imageUrl = imgurResponse.data.data.link;

      // Save file information in the database
      const newFile = new File({
        fileName: file.name,
        contentType: file.mimetype,
        url: imageUrl,
      });
      await newFile.save();

      return res.status(200).json({
        message: "File uploaded successfully",
        data: { url: imageUrl },
      });
    } else {
      return res.status(500).json({ error: "Failed to upload file to Imgur" });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: "File upload failed" });
  }
};
 

export default uploadFiles;