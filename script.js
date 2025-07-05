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

  // Generación de un ID único para la transacción
  const clientTransactionId = "pedido_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);  // ID único con timestamp y valor aleatorio

  // Solicitud de pago a PayPhone
  const paymentRequest = {
    amount: totalCentavos,  // Total en centavos
    amountWithoutTax: baseSinIVA,  // Monto sin impuestos en centavos
    tax: iva,  // IVA calculado
    service: 0,  // Servicios adicionales (si aplica)
    tip: 0,  // Propina (si aplica)
    clientTransactionId: clientTransactionId  // ID único de transacción
  };

  const payphoneContainer = document.getElementById("payphone-button-container");
  payphoneContainer.innerHTML = "";  // Limpiar el contenedor antes de crear el botón

  // Crear el botón de PayPhone
  const button = PayPhone.Button({
    token: "OIUirdECIEZuryUo288QjF61WMxr-PUi1lHAwicDRFsYdk73OME5QslNeTC-zGyZY4KdedeGFtgzqDFQe5KGqiHqAc-2kMMf5xSDRERDcz_5tC46-9BwJmn6UU_57mSCN07wE_inzwNN895r7cNfg1E9PYNBSHznz51_q8mWK0x9lXPq1msuBowat1a2MWSNC2qtBWvvWI_YiLeKPCDy2fd33i8A7dXFszokNkxK7YAXgP7lesqP3hogmdMLZLwXPYYv-xI5cANlXu6thdU3_wbqiSuBFqp6cjxwevz-74nbz7mT0BB184oBnC6Vzo-QOuvqR9bD9oGMhfnCGBoGaRJmEiY",  // Reemplaza con tu token de PayPhone
    btnText: "Pagar ahora",  // Texto del botón
    storeId: "fedbba10-1954-4e89-a11a-33a2b04fd2c0", // ID de la tienda
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






