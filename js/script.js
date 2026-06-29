// Trae los items/productos de la api y los muestra en cards
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://dummyjson.com/products/category/furniture")
    .then((response) => response.json())
    .then((data) => {
      const productosContainer = document.querySelector(".productos-furniture");

      data.products.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${producto.thumbnail}" alt="${producto.title}" />
          <div class="card-body">
            <h3>${producto.title}</h3>
            <p class="descripcion">${producto.description}</p>
            <div class="precio-box">$${producto.price}</div>
          </div>
        `;

        const btnAgregar = document.createElement("button");
        btnAgregar.classList.add("btn-agregar");
        btnAgregar.textContent = "Agregar al carrito";
        btnAgregar.addEventListener("click", () => {
          agregarAlCarrito({
            id: producto.id,
            title: producto.title,
            price: producto.price,
            thumbnail: producto.thumbnail,
          });
        });
        card.querySelector(".card-body").appendChild(btnAgregar);

        productosContainer.appendChild(card);
      });
    })
    .catch((error) => console.error("Error al cargar los productos:", error));
});
