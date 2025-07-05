// Inicializar el carrito y la lista de productos
const cart = [];

// Productos disponibles
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

// Variable para contar las transacciones
let transactionCounter = 1; // Iniciar contador desde 1

// Actualiza el carrito en el DOM
function updateCart() {
  const cartList = document.getElementById('cart');
  cartList.innerHTML = "";  // Limpia la lista de productos del carrito
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price;
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - $${item.price.toFixed(2)}
      <button onclick="removeFromCart(${index})" class="remove-btn">❌</button>`;
    cartList.appendChild(li);
  });

  const iva = subtotal * 0.11;  // 11% de IVA
  const total = subtotal + iva;

  // Actualiza los valores en el carrito
  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("iva").textContent = iva.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

// Elimina un producto del carrito
function removeFromCart(index) {
  cart.splice(index, 1);  // Elimina el producto del carrito
  updateCart();  // Actualiza el carrito
}

// Renderiza los productos en el DOM
const container = document.getElementById('product-list');
products.forEach(product => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>Precio: $${product.price.toFixed(2)}</p>
    <button>Añadir al carrito</button>`;
  card.querySelector('button').addEventListener('click', () => {
    cart.push(product);  // Añade el producto al carrito
    updateCart();  // Actualiza el carrito
  });
  container.appendChild(card);
});

// Procesa el pago con PayPhone
document.getElementById('payButton').addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  // Calcular total en centavos
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const totalCentavos = Math.round(total * 100);  // Convertir a centavos
  const baseSinIVA = Math.round(totalCentavos / 1.11);  // Monto sin IVA
  const iva = totalCentavos - baseSinIVA;  // Monto del IVA

  // Generar un ID único para la transacción (pedido_1, pedido_2, ...)
  const transactionId = "pedido_" + transactionCounter;
  transactionCounter++;  // Incrementar el contador para la siguiente transacción

  // Solicitud de pago a PayPhone
  const paymentRequest = {
    amount: totalCentavos,  // Total en centavos
    amountWithoutTax: baseSinIVA,  // Monto sin impuestos en centavos
    tax: iva,  // IVA calculado
    service: 0,  // Servicios adicionales (si aplica)
    tip: 0,  // Propina (si aplica)
    storeId: "fedbba10-1954-4e89-a11a-33a2b04fd2c0", // ID de la tienda
    client2TransactionId: transactionId // ID único de transacción generado automáticamente
  };

  const payphoneContainer = document.getElementById("payphone-button-container");
  payphoneContainer.innerHTML = "";  // Limpiar el contenedor antes de crear el botón

  // Crear el botón de PayPhone
  const button = PayPhone.Button({
    token: "OIUirdECIEZuryUo288QjF61WMxr-PUi1lHAwicDRFsYdk73OME5QslNeTC-zGyZY4KdedeGFtgzqDFQe5KGqiHqAc-2kMMf5xSDRERDcz_5tC46-9BwJmn6UU_57mSCN07wE_inzwNN895r7cNfg1E9PYNBSHznz51_q8mWK0x9lXPq1msuBowat1a2MWSNC2qtBWvvWI_YiLeKPCDy2fd33i8A7dXFszokNkxK7YAXgP7lesqP3hogmdMLZLwXPYYv-xI5cANlXu6thdU3_wbqiSuBFqp6cjxwevz-74nbz7mT0BB184oBnC6Vzo-QOuvqR9bD9oGMhfnCGBoGaRJmEiY",  // Reemplaza con tu token de PayPhone
    btnText: "Pagar ahora",  // Texto del botón
    createOrder: () => paymentRequest, // Detalles de la orden
    container: "payphone-button-container", // Contenedor donde se renderiza el botón
    onComplete: function (response) {
      console.log("✅ Pago exitoso:", response);
      alert("✅ Su pago fue exitoso. ¡Gracias por su compra!");
      cart.length = 0; // Vaciar carrito después del pago
      updateCart();  // Actualiza el carrito
    },
    onError: function (error) {
      console.error("❌ Error al pagar:", error);
      alert("❌ Error al procesar el pago. Intente nuevamente.");
    }
  });

  payphoneContainer.appendChild(button);  // Agregar el botón al contenedor
});

