import { v2 as cloudinary } from 'cloudinary';

let configured = false;

const ensureConfigured = () => {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    configured = true;
  }
};

// Create a wrapper that ensures config before use
const cloudinaryWrapper = {
  uploader: {
    upload_stream: (opts, cb) => {
      ensureConfigured();
      return cloudinary.uploader.upload_stream(opts, cb);
    }
  },
  config: (cfg) => {
    ensureConfigured();
    return cloudinary.config(cfg);
  }
};

export default cloudinaryWrapper;
