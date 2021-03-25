require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const path = require("path");

const { PrismaClient } = require("@prisma/client");

const profileRouter = require("./routes/api/profile.routes");
const productsRouter = require("./routes/api/products.routes");
const uploadImagesRouter = require("./routes/api/uploadImages.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use("/upload-avatar", profileRouter);
app.use("/", profileRouter);

app.use("/product", productsRouter);
app.use("/products", productsRouter);
app.use("/upload-images", uploadImagesRouter);

app.listen(5000, () => {
  console.log("🚀 Server is a running!");
});
