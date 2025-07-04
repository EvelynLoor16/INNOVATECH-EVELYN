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

const container = document.getElementById('product-list');
const cartList = document.getElementById('cart');
const payButton = document.getElementById('payButton');
const cart = [];

function updateCart() {
  cartList.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)}
      <button onclick="removeFromCart(${index})" class="remove-btn">❌</button>
    `;
    cartList.appendChild(li);
  });

  const iva = subtotal * 0.11;
  const total = subtotal + iva;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("iva").textContent = iva.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

products.forEach(product => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>Precio: $${product.price.toFixed(2)}</p>
    <button>Añadir al carrito</button>
  `;
  card.querySelector('button').addEventListener('click', () => {
    cart.push(product);
    updateCart();
  });
  container.appendChild(card);
});

payButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const totalCentavos = Math.round(total * 100);
  const baseSinIVA = Math.round(totalCentavos / 1.11);
  const iva = totalCentavos - baseSinIVA;

  // Limpia el contenedor por si ya se generó antes
  const payphoneContainer = document.getElementById("payphone-button-container");
  payphoneContainer.innerHTML = "";

  // Genera nuevo botón PayPhone
  PayPhone.Button({
    token: "AQUI_TU_TOKEN_REAL", // Reemplázalo por tu token real de PayPhone
    btnText: "Pagar Ahora",
    amount: totalCentavos,
    amountWithoutTax: baseSinIVA,
    tax: iva,
    clientTransactionId: "pedido_" + Date.now(),
    container: "payphone-button-container",
    callback: function (response) {
      console.log("Respuesta PayPhone:", response);
      alert("✅ Su pago fue exitoso. ¡Gracias por su compra!");
      cart.length = 0;
      updateCart();
    }
  });
});

