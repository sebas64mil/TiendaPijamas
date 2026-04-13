// Array de productos de ejemplo
window.productos = [
  {
    nombre: "Algodón para dama pantalón largo ",
    precio: 50000,
    imagen: "Assets/Img/pijama1.jpeg",
    alt: "Pijama Producto 1",
    type: "mujer"
  },
  {
    nombre: "Algodón para hombre pantalón largo ",
    precio: 48000,
    imagen: "Assets/Img/pijama2.jpeg",
    alt: "Pijama Producto 2",
    type: "hombre"
  },
  {
    nombre: "Pijama Ceda para dama",
    precio: 65000,
    imagen: "Assets/Img/pijama3.jpeg",
    alt: "Pijama Producto 3",
    type: "mujer"
  },
  {
    nombre: "Buso pantalón",
    precio: 98000,
    imagen: "Assets/Img/pijama4.jpeg",
    alt: "Pijama Producto 4",
    type: "mujer"
  },
  {
    nombre: "Peluches con cobija",
    precio: 110000,
    imagen: "Assets/Img/pijama5.jpeg",
    alt: "Pijama Producto 5",
    type: "hombre"
  },
  {
    nombre: "Pijama en botón ceda",
    precio: 60000,
    imagen: "Assets/Img/pijama6.jpeg",
    alt: "Pijama Producto 6",
    type: "mujer"
  }
];

function renderProductos(filtro = "todas") {
  const container = document.querySelector('.productos-container');
  container.innerHTML = '';
  let productosFiltrados = window.productos;
  if (filtro === "hombre" || filtro === "mujer") {
    productosFiltrados = window.productos.filter(p => (p.type && p.type.toLowerCase() === filtro));
  }
  if (productosFiltrados.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;">No hay productos para esta categoría.</p>';
    return;
  }
  productosFiltrados.forEach((producto) => {
    const idx = window.productos.indexOf(producto);
    const card = document.createElement('div');
    card.className = 'producto-card';
    card.innerHTML = `
      <div class="producto-img-container">
        <img src="${producto.imagen}" alt="${producto.alt}" class="producto-img">
      </div>
      <div class="producto-info-row">
        <div class="producto-info-col">
          <span class="producto-nombre" data-fullname="${producto.nombre}">${producto.nombre}</span>
          <span class="producto-precio">$${producto.precio.toLocaleString('es-CO')}</span>
        </div>
        <button class="producto-add-btn" data-idx="${idx}">
          <img src="Assets/Img/AñadirAlCarrito.png" alt="Añadir al carrito" class="add-cart-icon">
        </button>
      </div>
    `;
    container.appendChild(card);
  });
  setTimeout(() => {
    const btns = document.querySelectorAll('.producto-add-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-idx');
        if (window.productos && window.productos[idx] && window.agregarAlCarrito) {
          window.agregarAlCarrito(window.productos[idx]);
        }
      });
    });
  }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProductos();
  const filtro = document.getElementById('tipo-pijama');
  if (filtro) {
    filtro.addEventListener('change', function() {
      renderProductos(this.value);
    });
  }
});

// --- Lógica de pago con PayPal ---
window.inicializarPayPal = function() {
  if (!window.paypal) return;
  const paypalContainer = document.getElementById("paypal-button-container");
  if (paypalContainer) paypalContainer.innerHTML = ""; // Limpia antes de renderizar
  paypal.Buttons({
    createOrder: function (data, actions) {
      const total = window.totalDelCarrito ? window.totalDelCarrito() : 0;
      if (total <= 0) {
        alert("Agrega productos antes de pagar.");
        return;
      }
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: total.toFixed(0)
            }
          }
        ]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        const nombre = details?.payer?.name?.given_name || "cliente";
        alert(`Pago exitoso. Gracias ${nombre} 🙌`);
        if (window.vaciarCarrito) window.vaciarCarrito(false);
      });
    },
    onError: function (err) {
      console.error(err);
      alert("Error en el pago con PayPal");
    }
  }).render("#paypal-button-container");
};

// --- Lógica de simulación de tarjeta de crédito ---
window.pagarConTarjeta = function() {
  const total = window.totalDelCarrito ? window.totalDelCarrito() : 0;
  if (total <= 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  const numero = prompt("Ingresa número de tarjeta (16 dígitos):");
  const nombre = prompt("Nombre en la tarjeta:");
  const cvv = prompt("CVV:");
  if (!numero || numero.length !== 16 || isNaN(numero)) {
    alert("Número de tarjeta inválido");
    return;
  }
  if (!cvv || cvv.length < 3) {
    alert("CVV inválido");
    return;
  }
  if (!nombre) {
    alert("Nombre requerido");
    return;
  }
  alert(`Pago aprobado por ${window.formatearPrecio ? window.formatearPrecio(total) : total} 🎉`);
  if (window.vaciarCarrito) window.vaciarCarrito(false);
};
