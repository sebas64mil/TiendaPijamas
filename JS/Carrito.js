
// --- LÓGICA DEL CARRITO DE COMPRAS ---
document.addEventListener('DOMContentLoaded', function() {
	let carrito = new Map();

	// Referencias a elementos del DOM
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

	if (cartPopupClose) {
		cartPopupClose.addEventListener('click', hideCartPopup);
	}

	function updateCartCount() {
		// Mostrar solo la cantidad de productos distintos
		const count = carrito.size;
		if (cartCount) cartCount.textContent = count;
	}

	function formatearPrecio(valor) {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0
		}).format(valor);
	}

	function updateCartPopup() {
		if (!cartPopupList || !cartPopupBody) return;
		cartPopupList.innerHTML = '';
		let empty = true;
		let total = 0;
		carrito.forEach((item, key) => {
			empty = false;
			const totalProducto = item.precio * item.cantidad;
			total += totalProducto;
			const li = document.createElement('li');
			li.className = 'cart-popup-item';
			li.innerHTML = `
				<span class="cart-popup-nombre">${item.nombre}</span>
				<span class="cart-popup-precio">${formatearPrecio(totalProducto)}</span>
				<div class="cart-popup-cantidad">
					<button class="cart-btn-menos" data-key="${key}"><img src="Assets/Icons/Menos.png" alt="Menos"></button>
					<span class="cart-cantidad-num">${item.cantidad}</span>
					<button class="cart-btn-mas" data-key="${key}"><img src="Assets/Icons/Plus.png" alt="Más"></button>
				</div>
			`;
			cartPopupList.appendChild(li);
		});
		const emptyMsg = cartPopupBody.querySelector('.cart-empty');
		if (emptyMsg) emptyMsg.style.display = empty ? 'block' : 'none';
		cartPopupList.style.display = empty ? 'none' : 'block';

		// Eventos para los botones de suma/resta
		cartPopupList.querySelectorAll('.cart-btn-mas').forEach(btn => {
			btn.onclick = function() {
				const key = this.getAttribute('data-key');
				if (carrito.has(key)) {
					carrito.get(key).cantidad++;
					updateCartCount();
					updateCartPopup();
				}
			};
		});
		cartPopupList.querySelectorAll('.cart-btn-menos').forEach(btn => {
			btn.onclick = function() {
				const key = this.getAttribute('data-key');
				if (carrito.has(key)) {
					if (carrito.get(key).cantidad > 1) {
						carrito.get(key).cantidad--;
					} else {
						carrito.delete(key);
					}
					updateCartCount();
					updateCartPopup();
				}
			};
		});
		// Mostrar/ocultar botón de basura inferior y actualizar total
		let cartTrashBtn = document.getElementById('cart-trash-btn');
		let cartTotalLabel = document.getElementById('cart-total-label');
		if (cartTotalLabel) {
			cartTotalLabel.textContent = `Total: ${formatearPrecio(total)}`;
			if (empty) {
				cartTotalLabel.classList.remove('visible');
			} else {
				cartTotalLabel.classList.add('visible');
			}
		}
		if (cartTrashBtn) {
			if (empty) {
				cartTrashBtn.classList.remove('visible');
			} else {
				cartTrashBtn.classList.add('visible');
			}
			// Evitar múltiples listeners: quitar todos antes de agregar
			const newBtn = cartTrashBtn.cloneNode(true);
			cartTrashBtn.parentNode.replaceChild(newBtn, cartTrashBtn);
			newBtn.addEventListener('click', function() {
				carrito.clear();
				updateCartCount();
				updateCartPopup();
			});
		}
	}

	// Cerrar popup al hacer clic fuera de él o en el icono si ya está abierto
	// Switch: click en icono abre/cierra popup
	if (cartIcon) {
		cartIcon.addEventListener('click', function(e) {
			e.stopPropagation();
			if (cartPopup.style.display === 'block') {
				hideCartPopup();
			} else {
				showCartPopup();
			}
		});
	}
	// Cerrar popup al hacer clic fuera de él (pero no en el icono)
	document.addEventListener('mousedown', function(e) {
		if (cartPopup.style.display === 'block') {
			if (!cartPopup.contains(e.target) && e.target !== cartIcon) {
				hideCartPopup();
			}
		}
	});

	// Solo permite añadir desde la card si NO está en el carrito
	function agregarAlCarrito(producto) {
		if (!producto || !producto.nombre) return;
		const key = producto.nombre;
		if (carrito.has(key)) {
			// No añadir de nuevo si ya existe
			return;
		} else {
			carrito.set(key, { ...producto, cantidad: 1 });
		}
		updateCartCount();
		updateCartPopup();
	}

	window.agregarAlCarrito = agregarAlCarrito;
	updateCartCount();
	updateCartPopup();
});
