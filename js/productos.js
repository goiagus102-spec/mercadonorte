const URL = "https://opensheet.elk.sh/1UmususFi6aUhxJ5xE1WfGMQ5s9DcZQ4Wx_UZw-h3-eVmI/Respuestas%20de%20formulario%201";

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

/* ===========================
   NORMALIZADOR DE SHEETS
=========================== */
function normalizarProducto(fila) {
  const result = {
    imagen: "",
    nombre: "",
    vendedor: "",
    precio: "",
    contacto: ""
  };

  for (const key in fila) {
    const k = key.toLowerCase();
    const value = fila[key];
    if (!value) continue;

    if (!result.imagen && /imagen|foto|img|picture|photo/.test(k)) {
      result.imagen = value;
    } else if (!result.nombre && /producto|nombre|titulo|title/.test(k)) {
      result.nombre = value;
    } else if (!result.vendedor && /vendedor|autor|creador|seller/.test(k)) {
      result.vendedor = value;
    } else if (!result.precio && /precio|\$|valor|costo|price/.test(k)) {
      result.precio = value;
    } else if (!result.contacto && /contacto|whatsapp|ig|instagram|mail|email|tel/.test(k)) {
      result.contacto = value;
    }
  }

  return result;
}

fetch(URL)
  .then(res => res.json())
  .then(data => {
    contenedor.innerHTML = "";

    if (data.length === 0) {
      contenedor.innerHTML = "<p>No hay productos publicados.</p>";
      return;
    }

    data.reverse().forEach(fila => {
      const p = normalizarProducto(fila);

      const card = document.createElement("div");
      card.className = "product";

      // Imagen (sin validar extensión)
      let imgElement;
      if (p.imagen && p.imagen.startsWith("http")) {
        imgElement = document.createElement("img");
        imgElement.src = p.imagen;
        imgElement.alt = "Producto";
        imgElement.onerror = () => {
          imgElement.replaceWith(createNoImg());
        };
      } else {
        imgElement = createNoImg();
      }

      const h3 = document.createElement("h3");
      h3.textContent = p.nombre;

      const vendedor = document.createElement("p");
      vendedor.textContent = p.vendedor;

      const precio = document.createElement("p");
      precio.className = "price";
      precio.textContent = p.precio ? "$" + p.precio : "";

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

        modalImg.src = p.imagen || "";
        modalImg.onerror = () => modalImg.src = "";

        modalNombre.textContent = p.nombre;
        modalVendedor.textContent = "Vendedor: " + p.vendedor;
        modalPrecio.textContent = p.precio ? "$" + p.precio : "";
        modalContacto.href = p.contacto || "#";
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
