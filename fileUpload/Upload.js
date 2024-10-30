import { v2 as cloudinary } from "cloudinary";

const UploadFile = async (data) => {
  // Configuration
  cloudinary.config({
    cloud_name: "dpqtstag4",
    api_key: "349391496389745",
    api_secret: "OVlymWhrMzR3sE2jDbcOvq-VZVc",
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(data, {
      public_id: "data_id",
    });



    const optimizeUrl = cloudinary.url("shoes", {
      fetch_format: "auto",
      quality: "auto",
    });

 
    return autoCropUrl;
  } catch (error) {
    console.log(error);
    throw new Error("Upload failed");
  }
};

export default UploadFile;
