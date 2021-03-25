const express = require("express");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

const routes = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.AWS_BUCKET_NAME,
});

const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "onclick",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profileImage");

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// routes.post("/", (req, res) => {
//   profileImgUpload(req, res, (error) => {
//     console.log("files", req.files);
//     if (error) {
//       console.log("error", error);
//       res.json({ error: error });
//     } else {
//       // If File not found
//       if (req.files === undefined) {
//         console.log("Error: No File Selected!");
//         res.json("Error: No File Selected");
//       } else {
//         const imageName = req.file.key;
//         const imageLocation = req.file.location;
//         // Save the file name into database into profile Model

//         res.json({
//           image: imageName,
//           location: imageLocation,
//         });
//       }
//     }
//   });
// });

routes.post("/", multer().single("file"), (req, res) => {
  res.json({ message: "upload" });
});

routes.get("/", (req, res) => {
  res.json({ message: "ok" });
});

module.exports = routes;
