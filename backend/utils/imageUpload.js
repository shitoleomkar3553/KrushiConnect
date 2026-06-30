const cloudinary = require('../config/cloudinary');

function isCloudinaryUrl(url) {
  return typeof url === 'string' && url.includes('res.cloudinary.com');
}

async function uploadToCloudinary(file) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'krushiconnect/products',
        public_id: `product-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });
}

async function deleteFromCloudinary(imageUrl) {
  if (!isCloudinaryUrl(imageUrl)) return;

  try {
    const uploadIndex = imageUrl.indexOf('/upload/');
    if (uploadIndex === -1) return;

    let publicIdPath = imageUrl.slice(uploadIndex + '/upload/'.length);
    publicIdPath = publicIdPath.replace(/^v\d+\//, '');
    const publicId = publicIdPath.replace(/\.[^/.]+$/, '');

    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Failed to delete Cloudinary image:', err.message);
  }
}

module.exports = { uploadToCloudinary, deleteFromCloudinary, isCloudinaryUrl };
