// --- Render visual de duelo y top ranking ---
window.renderDuelo = function() {
	const dueloDiv = document.getElementById('duelo-container');
	if (!dueloDiv || !window.generarDuelo) return;
	const { p1, p2 } = window.generarDuelo();
	dueloDiv.innerHTML = `
		<div class="duelo-title">⚔️ Duelo de productos</div>
		<div class="duelo-productos">
			<div class="duelo-card">
				<img src="${p1.imagen}" alt="${p1.alt}" class="duelo-img">
				<div class="duelo-nombre">${p1.nombre}</div>
				<button class="duelo-btn" data-ganador="${p1.id}" data-perdedor="${p2.id}">Elegir</button>
			</div>
			<span class="duelo-vs">VS</span>
			<div class="duelo-card">
				<img src="${p2.imagen}" alt="${p2.alt}" class="duelo-img">
				<div class="duelo-nombre">${p2.nombre}</div>
				<button class="duelo-btn" data-ganador="${p2.id}" data-perdedor="${p1.id}">Elegir</button>
			</div>
		</div>
	`;
	setTimeout(() => {
		dueloDiv.querySelectorAll('.duelo-btn').forEach(btn => {
			btn.onclick = function() {
				const ganador = parseInt(this.getAttribute('data-ganador'));
				const perdedor = parseInt(this.getAttribute('data-perdedor'));
				window.votarDuelo(ganador, perdedor);
				window.renderDuelo();
			};
		});
	}, 100);
}

window.renderTop = function() {
	const topDiv = document.getElementById('top-container');
	if (!topDiv || !window.productos) return;
	let ratings = JSON.parse(localStorage.getItem('eloRatings') || '{}');
	const ordenados = [...window.productos].sort((a, b) => (ratings[b.id]||1000) - (ratings[a.id]||1000)).slice(0, 3);
	topDiv.innerHTML = `
		<div class="top-title">🏆 Top productos</div>
		<ol class="top-list">
			${ordenados.map(p => `<li><span class="top-nombre">${p.nombre}</span> <span class="top-puntaje">(${ratings[p.id]})</span></li>`).join('')}
		</ol>
	`;
}

// Hook para actualizar visuales al votar
const oldVotarDuelo = window.votarDuelo;
window.votarDuelo = function(ganadorId, perdedorId) {
	if (oldVotarDuelo) oldVotarDuelo(ganadorId, perdedorId);
	window.renderTop();
	window.renderRecomendados();
}

// Inicializar visuales al cargar
document.addEventListener('DOMContentLoaded', () => {
	window.renderDuelo();
	window.renderTop();
});

// --- ELO y recomendados inteligentes ---
(function() {
	if (!window.productos) return;
	// Asegurar IDs y categorías
	window.productos.forEach((p, i) => {
		if (!p.id) p.id = i + 1;
		if (!p.categoria) p.categoria = p.type || 'General';
	});

	// ELO ratings por id
	let ratings = JSON.parse(localStorage.getItem('eloRatings') || '{}');
	window.productos.forEach(p => {
		if (!ratings[p.id]) ratings[p.id] = 1000;
	});
	function saveRatings() {
		localStorage.setItem('eloRatings', JSON.stringify(ratings));
	}

	// Última categoría visitada (simulada, puedes actualizarla según navegación real)
	let ultimaCategoria = localStorage.getItem('ultimaCategoria') || 'mujer';
	window.setUltimaCategoria = function(cat) {
		ultimaCategoria = cat;
		localStorage.setItem('ultimaCategoria', cat);
		window.renderRecomendados();
	}

	// ELO realista
	function actualizarElo(ganadorId, perdedorId) {
		const K = 32;
		const r1 = ratings[ganadorId];
		const r2 = ratings[perdedorId];
		const esperado1 = 1 / (1 + Math.pow(10, (r2 - r1) / 400));
		const esperado2 = 1 / (1 + Math.pow(10, (r1 - r2) / 400));
		ratings[ganadorId] = Math.round(r1 + K * (1 - esperado1));
		ratings[perdedorId] = Math.round(r2 + K * (0 - esperado2));
		saveRatings();
	}
	window.actualizarElo = actualizarElo;

	// Duelo de productos
	window.generarDuelo = function() {
		const arr = window.productos;
		const p1 = arr[Math.floor(Math.random() * arr.length)];
		let p2;
		do {
			p2 = arr[Math.floor(Math.random() * arr.length)];
		} while (p1.id === p2.id);
		return { p1, p2 };
	}
	window.votarDuelo = function(ganadorId, perdedorId) {
		actualizarElo(ganadorId, perdedorId);
		window.renderTop();
		window.renderRecomendados();
	}

	// Render top ranking (ELO)
	window.renderTop = function() {
		const ordenados = [...window.productos].sort((a, b) => ratings[b.id] - ratings[a.id]);
		console.log('Top productos:', ordenados);
		// Puedes renderizar en el DOM si quieres una sección visual
		// Ejemplo: document.getElementById('top-container').innerHTML = ...
	}

	// Render recomendados inteligentes (por categoría y ELO)
	window.renderRecomendados = function() {
		const cont = document.getElementById('recomendados-container');
		if (!cont) return;
		// Filtrar por última categoría
		let candidatos = window.productos.filter(p => p.categoria && p.categoria.toLowerCase() === ultimaCategoria.toLowerCase());
		if (candidatos.length < 4) candidatos = window.productos;
		candidatos = [...candidatos].sort((a, b) => ratings[b.id] - ratings[a.id]);
		const top4 = candidatos.slice(0, 4);
		cont.innerHTML = '';
		top4.forEach(producto => {
			const card = document.createElement('div');
			card.className = 'recomendado-card';
			card.innerHTML = `
				<div class="recomendado-img-container">
					<img src="${producto.imagen}" alt="${producto.alt}" class="recomendado-img">
				</div>
				<div class="recomendado-info-row">
					<span class="recomendado-nombre">${producto.nombre}</span>
					<span class="recomendado-precio">$${producto.precio.toLocaleString('es-CO')}</span>
					<button class="recomendado-add-btn" data-idx="${window.productos.indexOf(producto)}">Agregar</button>
				</div>
			`;
			cont.appendChild(card);
		});
		setTimeout(() => {
			const btns = cont.querySelectorAll('.recomendado-add-btn');
			btns.forEach(btn => {
				btn.addEventListener('click', function() {
					const idx = this.getAttribute('data-idx');
					if (window.productos && window.productos[idx] && window.agregarAlCarrito) {
						window.agregarAlCarrito(window.productos[idx]);
						// Simular duelo: producto agregado gana a uno random
						const ganador = window.productos[idx];
						let perdedor;
						do {
							perdedor = window.productos[Math.floor(Math.random()*window.productos.length)];
						} while (perdedor.id === ganador.id);
						actualizarElo(ganador.id, perdedor.id);
						window.renderRecomendados();
					}
				});
			});
		}, 100);
	}

	// Inicializar al cargar
	document.addEventListener('DOMContentLoaded', () => {
		window.renderRecomendados();
	});
})();
