
// Array de productos de ejemplo
window.productos = [
  {
    nombre: "Pijama de poliéster ligera con estampado de Stitch",
    precio: 49900,
    imagen: "https://i.imgur.com/5bQAfN2.jpeg",
    alt: "Pijama Producto 1"
  },
  {
    nombre: "Pijama de algodón suave con estampado de ositos",
    precio: 52900,
    imagen: "Assets/Img/Porducto1.png",
    alt: "Pijama Producto 2"
  },
  {
    nombre: "Pijama de franela térmica para invierno",
    precio: 59900,
    imagen: "Assets/Img/Porducto1.png",
    alt: "Pijama Producto 3"
  },
  {
    nombre: "Pijama de unicornio para niños",
    precio: 48900,
    imagen: "Assets/Img/Porducto1.png",
    alt: "Pijama Producto 4"
  },
  {
    nombre: "Pijama de dos piezas con rayas pastel",
    precio: 51900,
    imagen: "Assets/Img/Porducto1.png",
    alt: "Pijama Producto 5"
  },
  {
    nombre: "Pijama enteriza con capucha de animalitos",
    precio: 56900,
    imagen: "Assets/Img/Porducto1.png",
    alt: "Pijama Producto 6"
  }
];

function renderProductos() {
  const container = document.querySelector('.productos-container');
  container.innerHTML = '';
  window.productos.forEach((producto, idx) => {
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

  // Conectar botones al método agregarAlCarrito
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

document.addEventListener('DOMContentLoaded', renderProductos);
