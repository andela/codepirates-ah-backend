import 'dotenv/config';
import cloudinary from 'cloudinary';

const generateCloudinaryUrl = async (images = []) => Promise.all(
  images.map(async (file) => {
    const { secure_url } = await cloudinary.v2.uploader.upload(file.path);
    return secure_url;
  })
);
const cloudinaryHelper = { generateCloudinaryUrl };
export default cloudinaryHelper;
