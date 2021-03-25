const express = require("express");
const multer = require("multer");
const multerConfig = require("../../config/multer");

const { body, validationResult } = require("express-validator");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uploadImagesRouter = express.Router();

const upload = multer(multerConfig);

const updateImagesValidationRules = [
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

prisma.$use(async function (params, next) {
  const result = await next(params);
  if (params.model == "Image" && params.action == "create") {
    const result = await next(params);
    result.url = `${process.env.APP_URL}/files/${params.args.data.key}`;
  }
  return result;
});

uploadImagesRouter.patch(
  "/",
  upload.single("file"),
  updateImagesValidationRules,
  checkErrors,
  async (req, res) => {
    try {
      // console.log(req.file);
      const { productUuid } = req.body;
      const { originalname: name, size, key, location: url } = req.file;

      const product = await prisma.product.findUnique({
        where: { uuid: productUuid },
      });

      if (!product) throw { product: "Product not found!" };

      const file = await prisma.image.create({
        data: {
          name,
          key,
          size: Number(size),
          url,
          product: { connect: { id: product.id } },
        },
      });

      res.json(file);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

module.exports = uploadImagesRouter;
