import { v2 } from 'cloudinary';
//import dotenv from 'dotenv';

//dotenv.config(); // Load env vars

export default cloudinary = v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// const uploadImage = async (image) => {
//     try {
//         const result = await cloudinary.uploader.upload(image, {
//             upload_preset: cloudinaryPRESET,
//         });
//         return result.secure_url;
//     } catch (error) {
//         console.error("Error uploading image to Cloudinary", error);
//         throw new Error("Error uploading image");
//     }
// };  

// const deleteImage = async (publicId) => {
//     try {
//         await cloudinary.uploader.destroy(publicId);
//     } catch (error) {
//         console.error("Error deleting image from Cloudinary", error);
//         throw new Error("Error deleting image");
//     }
// };
// const getImageUrl = (publicId) => {
//     return `https://res.cloudinary.com/${cloudinaryAPI}/image/upload/${publicId}`;
// };

// const getImagePublicId = (url) => {
//     const regex = /\/([^/]+)\.(jpg|jpeg|png|gif)/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
// };
// const getImagePublicIdFromUrl = (url) => {
//     const regex = /\/([^/]+)\.(jpg|jpeg|png|gif)/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
// };
// const getImageUrlFromPublicId = (publicId) => {
//     return `https://res.cloudinary.com/${cloudinaryAPI}/image/upload/${publicId}`;
// };