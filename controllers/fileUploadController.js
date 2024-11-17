import { put } from "@vercel/blob";

const uploadFile = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { file, fileName, contentType } = req.body;

    // Validate the required fields
    if (!file || !fileName || !contentType) {
      return res.status(400).json({ error: "Invalid file data." });
    }

    // Convert file data from base64 to a Buffer
    const fileBuffer = Buffer.from(file.split(",")[1], "base64"); // Remove the data URL part

    // Check the file size before attempting to upload
    if (fileBuffer.length > 50 * 1024 * 1024) {
      // 50MB limit
      return res.status(413).json({ error: "File is too large" });
    }

    // Upload the file to Vercel Blob
    const { url } = await put(fileName, fileBuffer, {
      contentType,
      access: "public", // Adjust access settings as needed
    });

    // Respond with the URL of the uploaded file
    return res.status(200).json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);

    // Handle specific error cases
    if (error.message.includes("413")) {
      return res.status(413).json({ error: "File is too large" });
    }

    return res.status(500).json({ error: "Failed to upload file." });
  }
};

export default uploadFile;
