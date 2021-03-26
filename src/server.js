require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

const PORT = process.env.APP_PORT || 5000;

const profilesRouter = require("./routes/profile.routes");
const productsRouter = require("./routes/products.routes");
const filesRouter = require("./routes/files.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/upload", filesRouter);
app.use("/files", filesRouter);
app.use("/upload-image-product", filesRouter);
app.use(
  "/file",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use("/upload-avatar", profilesRouter);
app.use("/profile", profilesRouter);

app.use("/product", productsRouter);
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is a running on port ${PORT}!`);
});
