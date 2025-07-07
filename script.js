const products = [
  { name: "Teclado Mecánico RGB", price: 45.00, image: "img/teclado.jpg" },
  { name: "Mouse Ergonómico", price: 25.00, image: "img/mouse.jpg" },
  { name: "Mouse Inalámbrico", price: 20.00, image: "img/mouses.jpg" },
  { name: "Computadora All-in-One", price: 550.00, image: "img/pc.png" },
  { name: "Cable HDMI 4K", price: 9.99, image: "img/hdmi.jpg" },
  { name: "Forro para Laptop 15''", price: 14.99, image: "img/forros.jpg" },
  { name: "Forro para Laptop 15'' - Diseño 2", price: 14.99, image: "img/forros1.jpg" },
  { name: "Parlantes Bluetooth - Modelo A", price: 20.99, image: "img/parlantes.jpg" },
  { name: "Parlantes Bluetooth - Modelo B", price: 20.99, image: "img/parlantes1.jpg" },
  { name: "Parlantes Bluetooth - Modelo C", price: 35.99, image: "img/parlantes2.jpg" }
];

const container = document.getElementById("product-list");
  const cartList = document.getElementById("cart");
  const cartCount = document.getElementById("cart-count");
  const subtotalEl = document.getElementById("subtotal");
  const ivaEl = document.getElementById("iva");
  const totalEl = document.getElementById("total");

  let cart = [];

  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="agregar-btn" onclick="addToCart(${index})">Agregar</button>
    `;
    container.appendChild(card);
  });

  function addToCart(index) {
    cart.push(products[index]);
    updateCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
  }

  function updateCart() {
    cartList.innerHTML = "";
    let subtotal = 0;

    cart.forEach((product, i) => {
      subtotal += product.price;
      const li = document.createElement("li");
      li.innerHTML = `
        ${product.name} - $${product.price.toFixed(2)}
        <button onclick="removeFromCart(${i})"
          style="margin-left: 10px; background: transparent; border: none; color: red; cursor: pointer;">🗑️</button>
      `;
      cartList.appendChild(li);
    });

    const iva = subtotal * 0.12;
    const total = subtotal + iva;

    cartCount.textContent = cart.length;
    subtotalEl.textContent = subtotal.toFixed(2);
    ivaEl.textContent = iva.toFixed(2);
    totalEl.textContent = total.toFixed(2);
  }

  // Vaciar carrito
  document.getElementById("clearCart").addEventListener("click", () => {
    cart = [];
    updateCart();
    document.getElementById("pp-button").innerHTML = ""; // Limpiar la cajita si había
  });

  // ✅ Usar PayPhone Payment Box
  document.getElementById("payButton").addEventListener("click", () => {
  const totalValue = parseFloat(totalEl.textContent);       // Ej: 55.89
  const subtotalValue = parseFloat(subtotalEl.textContent); // Ej: 49.90
  const taxValue = parseFloat(ivaEl.textContent);           // Ej: 5.99

  if (totalValue === 0) {
    alert("El carrito está vacío. Agrega productos antes de pagar.");
    return;
  }

  const storeId = "fedbba10-1954-4e89-a11a-33a2b04fd2c0";
  const token = "OIUirdECIEZuryUo288QjF61WMxr-PUi1lHAwicDRFsYdk73OME5QslNeTC-zGyZY4KdedeGFtgzqDFQe5KGqiHqAc-2kMMf5xSDRERDcz_5tC46-9BwJmn6UU_57mSCN07wE_inzwNN895r7cNfg1E9PYNBSHznz51_q8mWK0x9lXPq1msuBowat1a2MWSNC2qtBWvvWI_YiLeKPCDy2fd33i8A7dXFszokNkxK7YAXgP7lesqP3hogmdMLZLwXPYYv-xI5cANlXu6thdU3_wbqiSuBFqp6cjxwevz-74nbz7mT0BB184oBnC6Vzo-QOuvqR9bD9oGMhfnCGBoGaRJmEiY";

  // 🧮 Convertir a centavos sin redondeo intermedio
  const amount = Math.round(totalValue * 100);            // Total en centavos
  const amountWithTax = Math.round(subtotalValue * 100);  // Subtotal en centavos
  const tax = Math.round(taxValue * 100);                 // IVA en centavos
  const amountWithoutTax = 0;                             // No hay productos exentos

  const transactionData = {
    amount,
    amountWithoutTax,
    amountWithTax,
    tax,
    clientTransactionId: Date.now().toString(),
    storeId,
    reference: "Compra en Innovatech",
    currency: "USD",
    email: "cliente@Innovatech.com",
    returnUrl: "https://innovatech-evelyn.onrender.com/"
  };

  const payButton = new PPaymentButtonBox({
    token,
    ...transactionData
  });

  payButton.render("pp-button");
});
