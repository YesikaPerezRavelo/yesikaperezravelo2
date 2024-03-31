const socket = io();

socket.emit("mensaje", "Mensaje recibido desde el cliente");

getProducts();

socket.on("receiveProducts", (products) => {
  renderProducts(products);
});

function addProduct() {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
  };

  console.log(product);

  socket.emit("addProduct", product);

  // Reset form fields
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("code").value = "";
  document.getElementById("stock").value = "";
}

function deleteProduct(productId) {
  socket.emit("deleteProduct", +productId);
  getProducts();
}

function getProducts() {
  socket.emit("getProducts");
}

function renderProducts(products) {
  const productsContainer = document.getElementById("products-container");
  let productCardsHTML = "";

  products.forEach((product) => {
    productCardsHTML += `
    <div class="product-card">
      <img class="product-thumbnail" src="${product.thumbnails}" alt="Product Thumbnail">
      <div class="product-details">
        <p class="product-title">${product.title}</p>
        <p class="product-description">${product.description}</p>
        <p class="product-price">$${product.price}</p>
        <p class="product-stock">Stock: ${product.stock}</p>
        <p class="product-code">Code: ${product.code}</p>
      </div>
      <div class="product-actions">
        <button class="delete-button" onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    </div>
    `;
  });

  productsContainer.innerHTML = productCardsHTML;
}
