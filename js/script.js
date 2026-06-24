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
        productosContainer.appendChild(card);
      });
    })
    .catch((error) => console.error("Error al cargar los productos:", error));
});
