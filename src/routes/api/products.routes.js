const express = require("express");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const productRouter = express.Router();

const productValidationRules = [
  body("name").isLength({ min: 1 }).withMessage("Name is must not be empty!"),
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

productRouter.post(
  "/",
  productValidationRules,
  checkErrors,
  async (req, res) => {
    const { name, description, published } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        published,
      },
    });

    res.json(product);
  }
);

productRouter.get("/", async (req, res) => {
  try {
    const productList = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
      },
    });
    return res.json(productList);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = productRouter;
