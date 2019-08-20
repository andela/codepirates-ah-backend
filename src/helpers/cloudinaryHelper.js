import 'dotenv/config';
import cloudinary from 'cloudinary';

export default async (images = []) => Promise.all(
  images.map(async (file) => {
    const { secure_url } = process.env.NODE_ENV === 'test'
      ? 'image.jpg'
      : await cloudinary.v2.uploader.upload(file.path);
    return secure_url;
  })
);
