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

app.get("/", (req, res) => {
  res.send(`
    <html>
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap"
      rel="stylesheet"
    />
      <head>
        <title>Bienvenido a nuestra tienda en línea</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
            font-family: "Montserrat", sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
          .button {
            background-color: #d78383;
            color: #fff;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 10px;
            font-family: "Montserrat", sans-serif;
          }
          button:hover {
            background-color: rgb(10, 3, 3);
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to our clases online</h1>
          <p>Are you searching for a class or do you want to post your class online?</p>
          <div>
            <button class="button" onclick="window.location.href='/api/products'">List of classes</button>
            <button class="button" onclick="window.location.href='/realtimeproducts'">Coach post your class</button>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const port = 8080;
const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    style: "index.css",
    layout: "products",
  });
});

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
