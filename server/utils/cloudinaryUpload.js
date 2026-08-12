import cloudinary from "../config/cloudinary.js";

// Uploads a file buffer (from multer memoryStorage) to Cloudinary.
// Returns { url, publicId } — the exact shape our models expect.
export const uploadToCloudinary = (fileBuffer, folder = "qorzen") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Deletes an image from Cloudinary using its publicId.
// Used when an admin replaces or removes an image.
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};