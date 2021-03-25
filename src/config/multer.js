const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, DIR);
    },
    filename: (req, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString("HEX");
      file.key = `${fileHash}-${file.originalname}`;
      return callback(null, file.key);
    },
  }),
  s3: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: function (req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("HEX");
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};

const DIR = path.resolve(__dirname, "..", "..", "tmp", "uploads");

module.exports = {
  dest: DIR,
  storage: storageTypes["local"],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/gif",
      "image/png",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type"));
    }
  },
};
