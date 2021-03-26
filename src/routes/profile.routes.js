const express = require("express");
const multer = require("multer");
const multerConfig = require("../config/multer");

const profileRouter = express.Router();

const upload = multer(multerConfig);

profileRouter.patch("/", upload.single("avatar"), (req, res) => {
  console.log(req.file);

  res.json({ message: "upload" });
});

profileRouter.get("/", (req, res) => {
  res.json({ message: "ok" });
});

profileRouter.put("/", (req, res) => {
  res.json({ message: "ok" });
});

module.exports = profileRouter;
