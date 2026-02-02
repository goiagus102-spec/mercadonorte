const URL = "https://opensheet.elk.sh/1UmusFi6aUhxJ5xE1WfGMQ5s9DcZQ4Wx_UZw-h3-eVmI/Respuestas%20de%20formulario%201";

const contenedor = document.getElementById("productos");
contenedor.innerHTML = "<p>Cargando productos…</p>";

fetch(URL)
  .then(res => res.json()) 
  .then(data => {
    contenedor.innerHTML = "";

    if (data.length === 0) {
      contenedor.innerHTML = "<p>No hay productos publicados.</p>";
      return;
    }

    data.reverse().forEach(p => {
      const card = document.createElement("div");
      card.className = "product";

      const img = (p["Link de imagen"] || "").trim();

      card.innerHTML = `
        ${
          img && img.startsWith("http")
            ? `<img src="${img}" alt="Producto" onerror="this.replaceWith(createNoImg())">`
            : `<div class="no-img">Sin imagen</div>`
        }
        <h3>${p["Nombre del producto"] || ""}</h3>
        <p>${p["Nombre del vendedor"] || ""}</p>
        <p class="price">$${p["Precio"] || ""}</p>
        <a class="btn ver-producto" href="#">Ver producto</a>
      `;

      contenedor.appendChild(card);

      // --- Modal ---
      const modal = document.getElementById("modal");
      const modalImg = document.getElementById("modal-img");
      const modalNombre = document.getElementById("modal-nombre");
      const modalVendedor = document.getElementById("modal-vendedor");
      const modalPrecio = document.getElementById("modal-precio");
      const modalContacto = document.getElementById("modal-contacto");
      const spanClose = document.querySelector(".modal-close");

      card.querySelector(".ver-producto").addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "block";
        modalImg.src = img;
        modalNombre.textContent = p["Nombre del producto"] || "";
        modalVendedor.textContent = "Vendedor: " + (p["Nombre del vendedor"] || "");
        modalPrecio.textContent = "$" + (p["Precio"] || "");
        modalContacto.href = p["Contacto"] || "#";
      });

      spanClose.onclick = () => {
        modal.style.display = "none";
      };

      window.onclick = (event) => {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    });
  })
  .catch(() => {
    contenedor.innerHTML = "<p>Error cargando productos.</p>";
  });

function createNoImg() {
  const div = document.createElement("div");
  div.className = "no-img";
  div.textContent = "Imagen no disponible";
  return div;
}

