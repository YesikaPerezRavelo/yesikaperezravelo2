import express from "express";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import ProductManager from "./utils/productManager.js";

const app = express();
const productManagerInstance = new ProductManager("data/products.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//BIENVENIDA
app.get("/", (req, res) => {
  res.send("Bievenido");
});

//ROUTES
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//PORT LISTEN
const port = 8080;
const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// REAL TIME PRODUCTS
app.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    style: "index.css",
    layout: "products",
  });
});

// SOCKET SERVER
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado -----> ", socket.id);

  socket.on("addProduct", async (productData) => {
    await productManagerInstance.addProduct(productData);
  });

  socket.on("deleteProduct", async (productId) => {
    await productManagerInstance.deleteProduct(productId);
  });

  socket.on("getProducts", async () => {
    const products = await productManagerInstance.getProducts();
    socket.emit("receiveProducts", products);
  });
});
