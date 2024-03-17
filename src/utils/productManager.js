import fs from "fs";

export default class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.loadProducts();
    this.incrementId = this.calculateIncrementId();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(
        this.path,
        JSON.stringify(this.products, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error(error);
      console.error("Error guardando productos:", error);
    }
  }

  calculateIncrementId() {
    // Para evitar que se repita el ID al ejecutar mas de una vez el script: Chequea el ID mas alto de la lista de productos y le agrega +1;
    const maxId = this.products.reduce(
      (max, product) => (product.id > max ? product.id : max),
      0
    );
    return maxId + 1;
  }

  addProduct(productData) {
    if (
      !productData.title ||
      !productData.description ||
      !productData.price ||
      !productData.status ||
      !productData.code ||
      !productData.stock
    ) {
      console.error("Error: Todos los campos son obligatorios.");
      return;
    }

    const codeExist = this.products.some(
      (product) => product.code === productData.code
    );

    if (codeExist) {
      console.error(
        `Error: Producto con código ${productData.code} ya existe.`
      );
      return;
    }

    const product = {
      id: this.incrementId++,
      ...productData,
      thumbnails: productData.thumbnails ?? [],
    };

    this.products.push(product);
    this.saveProducts();
  }

  getProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    }
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id == id);

    if (!product) {
      console.error(`Error: Producto con id ${id} no encontrado.`);
      return;
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    if (!id || !updatedFields) {
      console.error("Error: Todos los campos son obligatorios.");
      return;
    }

    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.error(`Error: Producto con ID ${id} no encontrado.`);
      return;
    }

    if (
      updatedFields.code &&
      this.products.some((product) => product.code === updatedFields.code)
    ) {
      console.error(
        `Error: Producto con código ${updatedFields.code} ya existe.`
      );
      return;
    }

    this.products[index] = { ...this.products[index], ...updatedFields };

    this.saveProducts();
    this.getProductById(id);
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      console.error(`Error: Producto con id ${id} no encontrado.`);
      return;
    }
    this.products = this.products.filter((product) => product.id !== id);
    this.saveProducts();
  }
}
