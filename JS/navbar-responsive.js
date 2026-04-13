// Navbar responsive: menú hamburguesa

document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('navbar-menu-btn');
  const mobileMenu = document.getElementById('navbar-mobile-menu');
  let menuOpen = false;

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      menuOpen = !menuOpen;
      mobileMenu.style.display = menuOpen ? 'flex' : 'none';
    });
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
      if (menuOpen && !mobileMenu.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
        mobileMenu.style.display = 'none';
        menuOpen = false;
      }
    });
    // Opcional: cerrar al hacer click en un link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.style.display = 'none';
        menuOpen = false;
      });
    });
  }
  // Sincronizar contador y evento carrito móvil
  const cartCount = document.getElementById('cart-count');
  const cartCountMobile = document.getElementById('cart-count-mobile');
  const cartIcon = document.getElementById('cart-icon');
  const cartIconMobile = document.getElementById('cart-icon-mobile');

  function syncCartCount() {
    if (cartCount && cartCountMobile) {
      cartCountMobile.textContent = cartCount.textContent;
    }
  }
  // Llamar al cargar y cada vez que cambie el carrito
  syncCartCount();
  const observer = new MutationObserver(syncCartCount);
  if (cartCount) observer.observe(cartCount, { childList: true });

  // Abrir carrito desde icono móvil
  if (cartIconMobile && cartIcon) {
    cartIconMobile.addEventListener('click', function(e) {
      e.preventDefault();
      cartIcon.click();
    });
  }
});
