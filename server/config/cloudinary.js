const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Storage for Resources (PDFs, Videos, etc.)
const resourceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campusbridge/resources',
    resource_type: 'auto', // Important for PDFs and Videos
    allowed_formats: ['pdf', 'doc', 'docx', 'mp4', 'mkv', 'png', 'jpg', 'jpeg'],
  },
});

// Storage for User Avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campusbridge/avatars',
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const uploadResource = multer({ storage: resourceStorage });
const uploadAvatar = multer({ storage: avatarStorage });

module.exports = {
  cloudinary,
  uploadResource,
  uploadAvatar,
};
