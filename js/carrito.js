// Trae el carrito de localStorage
function cargarCarrito() {
  const guardado = localStorage.getItem('carrito');
  return guardado ? JSON.parse(guardado) : [];
}

// Guarda el carrito en localStorage
function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agrega un producto, si ya estaba le suma 1 a la cantidad
function agregarAlCarrito(producto) {
  const carrito = cargarCarrito();
  const existente = carrito.find(item => item.id === producto.id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito(carrito);
  actualizarContador();
  animarBtnCarrito();
}

// Saca un producto del carrito
function eliminarDelCarrito(id) {
  const carrito = cargarCarrito().filter(item => item.id !== id);
  guardarCarrito(carrito);
  renderizarCarrito();
  actualizarContador();
}

// Suma o resta cantidad, si llega a 0 lo elimina
function cambiarCantidad(id, cambio) {
  const carrito = cargarCarrito();
  const item = carrito.find(i => i.id === id);
  if (!item) return;

  item.cantidad += cambio;
  if (item.cantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }

  guardarCarrito(carrito);
  renderizarCarrito();
  actualizarContador();
}

// Borra todo el carrito
function vaciarCarrito() {
  localStorage.removeItem('carrito');
  renderizarCarrito();
  actualizarContador();
}

// Simula la compra y vacía el carrito
function finalizarCompra() {
  const carrito = cargarCarrito();
  if (carrito.length === 0) {
    alert('Tu carrito está vacío 🛒');
    return;
  }

  alert('¡Gracias por tu compra!');
  vaciarCarrito();
  cerrarCarrito();
}

// Actualiza el numerito del carrito en el nav
function actualizarContador() {
  const carrito = cargarCarrito();
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const badge = document.getElementById('contador-carrito');
  if (!badge) return;
  badge.textContent = total;
  badge.style.display = total > 0 ? 'inline-flex' : 'none';
}

// Pinta los productos del carrito y el total
function renderizarCarrito() {
  const carrito = cargarCarrito();
  const lista = document.getElementById('lista-carrito');
  const totalEl = document.getElementById('total-carrito');
  if (!lista || !totalEl) return;

  lista.innerHTML = '';

  if (carrito.length === 0) {
    lista.innerHTML = '<li class="carrito-vacio">Tu carrito está vacío 🛒</li>';
    totalEl.textContent = 'Total: $0.00';
    return;
  }

  let totalGeneral = 0;

  carrito.forEach(item => {
    const subtotal = item.price * item.cantidad;
    totalGeneral += subtotal;

    const li = document.createElement('li');
    li.classList.add('carrito-item');
    li.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}" />
      <div class="carrito-item-info">
        <p class="carrito-nombre">${item.title}</p>
        <p class="carrito-precio">$${item.price.toFixed(2)} c/u</p>
        <div class="carrito-controles">
          <button onclick="cambiarCantidad(${item.id}, -1)">−</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
        </div>
        <p class="carrito-subtotal">Subtotal: $${subtotal.toFixed(2)}</p>
      </div>
      <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">✕</button>
    `;
    lista.appendChild(li);
  });

  totalEl.textContent = `Total: $${totalGeneral.toFixed(2)}`;
}

// Animación corta en el botón del carrito
function animarBtnCarrito() {
  const btn = document.getElementById('btn-carrito');
  if (!btn) return;
  btn.classList.add('carrito-pulse');
  setTimeout(() => btn.classList.remove('carrito-pulse'), 400);
}

// aAbre el panel del carrito
function abrirCarrito() {
  document.getElementById('panel-carrito').classList.add('abierto');
  document.getElementById('overlay-carrito').classList.add('abierto');
  renderizarCarrito();
}

// Cierra el panel del carrito
function cerrarCarrito() {
  document.getElementById('panel-carrito').classList.remove('abierto');
  document.getElementById('overlay-carrito').classList.remove('abierto');
}

// Crea el panel del carrito si no existe
function inyectarPanelCarrito() {
  if (document.getElementById('panel-carrito')) return;

  const panel = document.createElement('div');
  panel.id = 'panel-carrito';
  panel.className = 'panel-carrito';
  panel.innerHTML = `
    <div class="panel-header">
      <h3>🛒 Mi Carrito</h3>
      <button id="cerrar-carrito">✕</button>
    </div>
    <ul id="lista-carrito"></ul>
    <div class="panel-footer">
      <p id="total-carrito">Total: $0.00</p>
      <button id="finalizar-compra">Finalizar compra</button>
      <button id="vaciar-carrito">Vaciar carrito</button>
    </div>
  `;
  document.body.appendChild(panel);

  const overlay = document.createElement('div');
  overlay.id = 'overlay-carrito';
  overlay.className = 'overlay-carrito';
  document.body.appendChild(overlay);
}

// Agrega el botón del carrito al nav
function inyectarBotonNav() {
  const navUl = document.querySelector('nav ul');
  if (!navUl || document.getElementById('btn-carrito')) return;

  const li = document.createElement('li');
  li.innerHTML = `
    <a href="#" id="btn-carrito">
      🛒 Carrito
      <span id="contador-carrito" class="badge-carrito" style="display:none">0</span>
    </a>
  `;
  navUl.appendChild(li);
}

// Arranca todo cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
  inyectarBotonNav();
  inyectarPanelCarrito();
  actualizarContador();

  document.getElementById('btn-carrito').addEventListener('click', e => {
    e.preventDefault();
    abrirCarrito();
  });

  document.getElementById('cerrar-carrito').addEventListener('click', cerrarCarrito);
  document.getElementById('overlay-carrito').addEventListener('click', cerrarCarrito);
  document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);
  document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
});
