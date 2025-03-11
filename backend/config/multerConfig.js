const multer = require("multer");
const AWS = require("aws-sdk");
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION, 
  });
  
  const s3 = new AWS.S3();

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Only image files (JPEG, PNG, GIF) are allowed"), false); 
        }
      },
}).single("image");

module.exports = {upload,s3};