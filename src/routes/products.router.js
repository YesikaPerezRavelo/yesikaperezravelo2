import { Router } from "express";
import ProductManager from "../utils/productManager.js";

const router = Router();

const PM = new ProductManager();

router.get("/", async (req, res) => {
  let limit = +req.query.limit;
  const products = await PM.getProducts(limit);
  res.render("home", {
    style: "index.css",
    products: products,
    layout: "products",
  });
});

router.get("/:productId", async (req, res) => {
  let productId = +req.params.productId;
  let product = await PM.getProductById(productId);

  if (!product) {
    return res.send({ error: "Producto no encontrado" });
  }
  res.send({ product });
});

router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  try {
    await PM.addProduct({
      title,
      description,
      code,
      price,
      status: true,
      stock,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "error", error: "ha ocurrido un error" });
  }
  res.send({ status: "success", message: "producto agregado" });
});

router.put("/:productId", async (req, res) => {
  const productId = +req.params.productId;
  const productData = req.body;

  try {
    await PM.updateProduct(productId, productData);
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "error", error: "ha ocurrido un error" });
  }

  res.send({ status: "success", message: "producto editado" });
});

router.delete("/:productId", async (req, res) => {
  const productId = +req.params.productId;

  try {
    await PM.deleteProduct(productId);
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "error", error: "ha ocurrido un error" });
  }

  res.send({ status: "success", message: "producto eliminado" + productId });
});

export default router;
