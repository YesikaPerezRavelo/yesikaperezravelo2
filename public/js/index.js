const socket = io();

socket.emit("mensaje", "Mensaje recibido desde el cliente");

getProducts();

socket.on("receiveProducts", (products) => {
  renderProducts(products);
});

function addProduct() {
  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("code", document.getElementById("code").value);
  formData.append("stock", document.getElementById("stock").value);
  formData.append("category", document.getElementById("category").value);
  formData.append("thumbnails", document.getElementById("thumbnails").files[0]);

  socket.emit("addProduct", formData);

  // Reset form fields
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("thumbnails").value = "";
  document.getElementById("code").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("category").value = "";
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
