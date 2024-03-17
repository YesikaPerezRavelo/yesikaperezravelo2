import { Router } from "express";
import CartManager from "../utils/cartManager.js";

const router = Router();

const cartManagerInstance = new CartManager("data/carts.json");

router.post("/", async (req, res) => {
  try {
    await cartManagerInstance.addCart();
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "error", error: "ha ocurrido un error" });
  }

  res.send({ status: "success", message: "carrito creado" });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = +req.params.cid;
  const productId = req.params.pid;

  try {
    await cartManagerInstance.addProductToCart(cartId, productId);
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "error", error: "ha ocurrido un error" });
  }
  res.send({ status: "success", message: "producto agregado al carrito" });
});

router.get("/:cid", async (req, res) => {
  const cartId = +req.params.cid;
  const cart = await cartManagerInstance.getCart(cartId);
  if (!cart) {
    return res
      .status(400)
      .send({ status: "error", error: "ha ocurrido un error" });
  }
  res.send({ cart });
});

export default router;
