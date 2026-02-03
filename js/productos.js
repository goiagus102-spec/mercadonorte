const URL = "https://opensheet.elk.sh/1UmusFi6aUhxJ5xE1WfGMQ5s9DcZQ4Wx_UZw-h3-eVmI/Respuestas%20de%20formulario%201";

const contenedor = document.getElementById("productos");
contenedor.innerHTML = "<p>Cargando productos…</p>";

// Modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalNombre = document.getElementById("modal-nombre");
const modalVendedor = document.getElementById("modal-vendedor");
const modalPrecio = document.getElementById("modal-precio");
const modalContacto = document.getElementById("modal-contacto");
const spanClose = document.querySelector(".modal-close");

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

      const imgUrl = (p["Link de imagen"] || "").trim();

      // 👉 Imagen SIN validar extensión
      let imgElement;
      if (imgUrl && imgUrl.startsWith("http")) {
        imgElement = document.createElement("img");
        imgElement.src = imgUrl;
        imgElement.alt = "Producto";
        imgElement.onerror = () => {
          imgElement.replaceWith(createNoImg());
        };
      } else {
        imgElement = createNoImg();
      }

      const h3 = document.createElement("h3");
      h3.textContent = p["Nombre del producto"] || "";

      const vendedor = document.createElement("p");
      vendedor.textContent = p["Nombre del vendedor"] || "";

      const precio = document.createElement("p");
      precio.className = "price";
      precio.textContent = "$" + (p["Precio"] || "");

      const btn = document.createElement("a");
      btn.className = "btn ver-producto";
      btn.href = "#";
      btn.textContent = "Ver producto";

      card.append(imgElement, h3, vendedor, precio, btn);
      contenedor.appendChild(card);

      // Modal
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "block";

        modalImg.src = imgUrl || "";
        modalImg.onerror = () => {
          modalImg.src = "";
        };

        modalNombre.textContent = p["Nombre del producto"] || "";
        modalVendedor.textContent = "Vendedor: " + (p["Nombre del vendedor"] || "");
        modalPrecio.textContent = "$" + (p["Precio"] || "");
        modalContacto.href = p["Contacto"] || "#";
        modalContacto.target = "_blank";
      });
    });
  })
  .catch(() => {
    contenedor.innerHTML = "<p>Error cargando productos.</p>";
  });

// Cerrar modal
spanClose.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.style.display = "none";
});

function createNoImg() {
  const div = document.createElement("div");
  div.className = "no-img";
  div.textContent = "Imagen no disponible";
  return div;
    }
