import fs from "fs";

export default class CartManager {
  constructor(filepath) {
    this.path = filepath;
    this.cart = this.loadCarts();
    this.incrementId = this.calculateIncrementId();
  }

  calculateIncrementId() {
    const maxId = this.cart.reduce(
      (max, cart) => (cart.id > max ? cart.id : max),
      0
    );
    return maxId + 1;
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  saveCart() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.cart, null, 2), "utf-8");
    } catch (error) {
      console.error(error);
      console.error("Error guardando carrito:", error);
    }
  }

  addCart() {
    const cart = {
      id: this.incrementId++,
      products: [],
    };
    this.cart.push(cart);
    this.saveCart();
    return cart;
  }

  addProductToCart(cartid, productId, quantity = 1) {
    const cart = this.cart.find((cart) => cart.id == cartid);
    if (cart) {
      const existingProductIndex = cart.products.findIndex(
        (product) => product.product === productId
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({
          product: productId,
          quantity: quantity,
        });

        this.saveCart();
        return cart;
      }
    } else {
      console.error("carrito no encontrado");
      return;
    }
  }

  getCart(id) {
    const cart = this.cart.find((cart) => cart.id == id);
    if (!cart) {
      console.error("Carrito no encontrado");
      return;
    }
    return cart;
  }
}
