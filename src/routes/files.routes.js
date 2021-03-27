const express = require("express");
const multer = require("multer");
const multerConfig = require("../config/multer");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const aws = require("aws-sdk");

const s3 = new aws.S3();

const { dest: DIR } = multerConfig;

const { body, validationResult } = require("express-validator");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fileRouter = express.Router();

const upload = multer(multerConfig);

const fileValidationRules = [
  body("productUuid").exists().withMessage("Product not selected"),
];

const simpleValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const checkErrors = (req, res, next) => {
  const errors = simpleValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped());
  }
  next();
};

fileRouter.get("/", async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      include: {
        product: true,
      },
    });

    return res.json(files);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

prisma.$use(async function (params, next) {
  if (params.model == "File" && params.action == "create") {
    if (process.env.STORAGE_TYPE === "local") {
      params.args.data.url = `${process.env.APP_URL}/file/${params.args.data.key}`;
    }
  }
  return next(params);
});

fileRouter.patch("/", upload.single("file"), async (req, res) => {
  try {
    const { originalname: name, size, key, location: url } = req.file;

    const countFiles = await prisma.file.count();

    if (countFiles >= 100) {
      return res
        .status(401)
        .json({ message: "It exceeded the limit of uploads!" });
    }

    const file = await prisma.file.create({
      data: {
        name,
        key,
        size: Number(size),
        url,
      },
    });

    res.json(file);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

fileRouter.post(
  "/",
  upload.single("file"),
  fileValidationRules,
  checkErrors,
  async (req, res) => {
    try {
      const { productUuid } = req.body;
      const { originalname: name, size, key, location: url } = req.file;

      const product = await prisma.product.findUnique({
        where: { uuid: productUuid },
      });

      if (productUuid && !product) {
        throw { message: "Product not found!", code: 400 };
      }

      data = {
        name,
        key,
        size: Number(size),
        url,
        product: { connect: { id: product.id } },
      };

      const file = await prisma.file.create({
        data,
      });

      res.json(file);
    } catch (err) {
      return res.status(err.code || 500).json({ message: err.message });
    }
  }
);

fileRouter.delete("/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;
    const file = await prisma.file.delete({
      where: { uuid },
      select: {
        key: true,
      },
    });

    if (process.env.STORAGE_TYPE === "s3") {
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: file.key,
        })
        .promise();
    } else {
      await promisify(fs.unlink)(path.resolve(__dirname, DIR, file.key));
    }

    return res.status(200).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = fileRouter;
