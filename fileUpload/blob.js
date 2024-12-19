// import { put } from "@vercel/blob";

// const uploadFile = async (req, res) => {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).send("Method Not Allowed");
//   }

//   try {
//     const { file, fileName, contentType } = req.body;

//     // Validate the required fields
//     if (!file || !fileName || !contentType) {
//       return res.status(400).json({ error: "Invalid file data." });
//     }

//     // Convert file data from base64 to a Buffer
//     const fileBuffer = Buffer.from(file.split(",")[1], "base64"); // Remove the data URL part

//     // Check the file size before attempting to upload
//     if (fileBuffer.length > 50 * 1024 * 1024) {
//       // 50MB limit
//       return res.status(413).json({ error: "File is too large" });
//     }

//     // Upload the file to Vercel Blob
//     const { url } = await put(fileName, fileBuffer, {
//       contentType,
//       access: "public", // Adjust access settings as needed
//     });

//     // Respond with the URL of the uploaded file
//     return res.status(200).json({ url });
//   } catch (error) {
//     console.error("Error uploading file:", error);

//     // Handle specific error cases
//     if (error.message.includes("413")) {
//       return res.status(413).json({ error: "File is too large" });
//     }

//     return res.status(500).json({ error: "Failed to upload file." });
//   }
// };

// export default uploadFile;

import { put } from "@vercel/blob";
import formidable from "formidable";
import { createReadStream } from "fs";
import dotenv from "dotenv";

export const config = {
  api: {
    bodyParser: false,
  },
};
dotenv.config();
const uploadFile = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: "Invalid file type",
        allowedTypes,
      });
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.originalFilename}`;

    const stream = createReadStream(file.filepath);

    // console.log(process.env.VITE_BLOB_READ_WRITE_TOKEN)

    const { url } = await put(fileName, stream, {
      contentType: file.mimetype,
      access: "public",
      token: process.env.VITE_BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({
      url,
      fileName: file.originalFilename,
      size: file.size,
      type: file.mimetype,
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File is too large" });
    }

    return res.status(500).json({
      error: "Failed to upload file",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export default uploadFile;
