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

productRouter.get("/", async (req, res) => {
  try {
    const productList = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        files: {
          select: {
            id: true,
            uuid: true,
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

productRouter.post(
  "/",
  productValidationRules,
  checkErrors,
  async (req, res) => {
    try {
      const { name, description, published } = req.body;

      const productExist = await prisma.product.findUnique({ where: { name } });

      if (productExist) throw new Error("This product name already exist!");

      const product = await prisma.product.create({
        data: {
          name,
          description,
          published,
        },
      });

      res.json(product);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

productRouter.put("/:uuid", async (req, res) => {
  try {
    const fields = req.body;
    const { fileUuid } = fields;
    const { uuid } = req.params;

    delete fields.fileUuid;

    const productExist = await prisma.product.findUnique({ where: { uuid } });

    if (!productExist) throw new Error("This product not exist!");

    const product = await prisma.product.update({
      where: { uuid },
      data: {
        ...fields,
      },
      include: { files: true },
    });

    if (fileUuid) {
      const file = await prisma.file.findUnique({
        where: { uuid: fileUuid },
      });

      if (!file) throw new Error("File not found!");

      await prisma.file.update({
        where: { uuid: fileUuid },
        data: { product: { connect: { id: product.id } } },
      });
    }

    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

productRouter.get("/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;

    const product = await prisma.product.findUnique({
      where: { uuid },
      include: { files: true },
    });
    if (!product) throw new Error("Product not found!");

    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

productRouter.delete("/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;

    await prisma.product.delete({ where: { uuid } });

    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = productRouter;
