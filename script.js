// --- POPUP CARRITO ---
const cartIcon = document.getElementById('cart-icon');
const cartPopup = document.getElementById('cart-popup');
const cartPopupClose = document.getElementById('cart-popup-close');
const cartCount = document.getElementById('cart-count');
const cartPopupList = document.getElementById('cart-popup-list');
const cartPopupBody = document.getElementById('cart-popup-body');

function showCartPopup() {
  cartPopup.style.display = 'block';
}

function hideCartPopup() {
  cartPopup.style.display = 'none';
}

if (cartIcon && cartPopup && cartPopupClose) {
  cartIcon.addEventListener('click', showCartPopup);
  cartPopupClose.addEventListener('click', hideCartPopup);
}

function updateCartCount() {
  let count = 0;
  carrito.forEach(item => count += item.cantidad);
  if (cartCount) cartCount.textContent = count;
}

function updateCartPopup() {
  if (!cartPopupList || !cartPopupBody) return;
  cartPopupList.innerHTML = '';
  let empty = true;
  carrito.forEach(item => {
    empty = false;
    const li = document.createElement('li');
    li.textContent = `${item.nombre} x${item.cantidad}`;
    cartPopupList.appendChild(li);
  });
  const emptyMsg = cartPopupBody.querySelector('.cart-empty');
  if (emptyMsg) emptyMsg.style.display = empty ? 'block' : 'none';
  cartPopupList.style.display = empty ? 'none' : 'block';
}
const productos = [
  {
    id: 1,
    nombre: "Producto ejemplo",
    precio: 10000,
    categoria: "General",
    img: "https://via.placeholder.com/200"
  }
];

let carrito = new Map();

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const cantidadCarrito = document.getElementById("cantidad-carrito");

/* FORMATO COP */
function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(valor);
}

/* RENDER PRODUCTOS */
function renderProductos() {
  contenedorProductos.innerHTML = "";

  productos.forEach(p => {
    contenedorProductos.innerHTML += `
      <div class="producto">
        <img src="${p.img}">
        <h3>${p.nombre}</h3>
        <p>${formatearPrecio(p.precio)}</p>
        <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
      </div>
    `;
  });
}

/* CARRITO */
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (carrito.has(id)) {
    carrito.get(id).cantidad++;
  } else {
    carrito.set(id, { ...producto, cantidad: 1 });
  }
  actualizarCarrito();
  updateCartCount();
  updateCartPopup();
}

function actualizarCarrito() {
  if (typeof listaCarrito !== 'undefined' && listaCarrito) listaCarrito.innerHTML = "";
  let total = 0;
  let cantidad = 0;
  carrito.forEach(item => {
    total += item.precio * item.cantidad;
    cantidad += item.cantidad;
    if (typeof listaCarrito !== 'undefined' && listaCarrito) {
      listaCarrito.innerHTML += `<li>${item.nombre} x${item.cantidad}</li>`;
    }
  });
  if (typeof totalCarrito !== 'undefined' && totalCarrito) totalCarrito.textContent = formatearPrecio(total);
  if (typeof cantidadCarrito !== 'undefined' && cantidadCarrito) cantidadCarrito.textContent = cantidad;
  updateCartCount();
  updateCartPopup();
}

function vaciarCarrito() {
  carrito.clear();
  actualizarCarrito();
}

function finalizarCompra() {
  alert("Aquí conectas el pago");
}

/* INICIO */
renderProductos();
updateCartCount();
updateCartPopup();