import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer or local path to Cloudinary.
 * @param {Buffer|string} source - Buffer from multer or local file path
 * @param {object} options - Cloudinary upload options
 * @returns {object} { url, publicId, format, bytes }
 */
export async function uploadToCloudinary(source, options = {}) {
  const defaults = {
    folder: 'cloudswift',
    resource_type: 'auto',
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };
  const opts = { ...defaults, ...options };

  return new Promise((resolve, reject) => {
    if (Buffer.isBuffer(source)) {
      // Stream upload from buffer
      const uploadStream = cloudinary.uploader.upload_stream(opts, (err, result) => {
        if (err) { logger.error('Cloudinary upload error', { error: err.message }); return reject(err); }
        resolve({ url: result.secure_url, publicId: result.public_id, format: result.format, bytes: result.bytes });
      });
      uploadStream.end(source);
    } else {
      // Path upload
      cloudinary.uploader.upload(source, opts, (err, result) => {
        if (err) { logger.error('Cloudinary upload error', { error: err.message }); return reject(err); }
        resolve({ url: result.secure_url, publicId: result.public_id, format: result.format, bytes: result.bytes });
      });
    }
  });
}

/**
 * Delete a resource from Cloudinary by public_id.
 */
export async function deleteFromCloudinary(publicId, resourceType = 'image') {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    logger.warn('Cloudinary delete error', { publicId, error: err.message });
  }
}

export default cloudinary;
