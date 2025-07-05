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
    li.innerHTML = `${item.name} - $${item.price.toFixed(2)}
      <button onclick="removeFromCart(${index})" class="remove-btn">❌</button>`;
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
    <button>Añadir al carrito</button>`;
  card.querySelector('button').addEventListener('click', () => {
    cart.push(product);
    updateCart();
  });
  container.appendChild(card);
});

// Mostrar el modal con el formulario cuando se haga clic en el botón de pagar
payButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  // Mostrar modal con campos de datos
  document.getElementById('formModal').style.display = 'block';
});

// Función para cerrar el modal
function cerrarModal() {
  document.getElementById('formModal').style.display = 'none';
}

// Función para procesar el pago después de llenar los datos
function generarPago() {
  const cedula = document.getElementById("cedula").value;
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;

  if (!cedula || !nombre || !correo) {
    alert("Por favor completa todos los campos.");
    return;
  }

  // Aquí se simula el pago exitoso sin mostrar los datos
  alert("✅ Pago procesado exitosamente. ¡Gracias por su compra!");

  // Cerrar el modal después de procesar
  cerrarModal();
}

// Integración de PayPhone para realizar el pago
payButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const totalCentavos = Math.round(total * 100);
  const baseSinIVA = Math.round(totalCentavos / 1.11);
  const iva = totalCentavos - baseSinIVA;

  const paymentRequest = {
    amount: totalCentavos,
    amountWithoutTax: baseSinIVA,
    tax: iva,
    service: 0,
    tip: 0,
    clientTransactionId: "pedido_" + Date.now()
  };

  const payphoneContainer = document.getElementById("payphone-button-container");
  payphoneContainer.innerHTML = ""; // limpiar antes de generar

  const button = PayPhone.Button({
    token: "OIUirdECIEZuryUo288QjF61WMxr-PUi1lHAwicDRFsYdk73OME5QslNeTC-zGyZY4KdedeGFtgzqDFQe5KGqiHqAc-2kMMf5xSDRERDcz_5tC46-9BwJmn6UU_57mSCN07wE_inzwNN895r7cNfg1E9PYNBSHznz51_q8mWK0x9lXPq1msuBowat1a2MWSNC2qtBWvvWI_YiLeKPCDy2fd33i8A7dXFszokNkxK7YAXgP7lesqP3hogmdMLZLwXPYYv-xI5cANlXu6thdU3_wbqiSuBFqp6cjxwevz-74nbz7mT0BB184oBnC6Vzo-QOuvqR9bD9oGMhfnCGBoGaRJmEiY",
    btnText: "Pagar ahora",
    createOrder: () => paymentRequest,
    container: "payphone-button-container",
    onComplete: function (response) {
      console.log("✅ Pago exitoso:", response);
      alert("✅ Su pago fue exitoso. ¡Gracias por su compra!");
      cart.length = 0;
      updateCart();
    },
    onError: function (error) {
      console.error("❌ Error al pagar:", error);
      alert("❌ Error al procesar el pago. Intente nuevamente.");
    }
  });

  payphoneContainer.appendChild(button);
});


