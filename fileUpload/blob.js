import { createClient } from "@vercel/blob";

const blobClient = createClient({
  accessKey: process.env.VITE_BLOB_READ_WRITE_TOKEN, // Add to .env file
});
console.log("==============>", process.env.VITE_BLOB_READ_WRITE_TOKEN);
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { file, fileName, contentType } = req.body;

      if (!file || !fileName || !contentType) {
        return res.status(400).json({ error: "Invalid file data." });
      }

      const buffer = Buffer.from(file, "base64");
      const blob = await blobClient.put(fileName, buffer, {
        contentType,
      });

      res.status(200).json({ url: blob.url });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
