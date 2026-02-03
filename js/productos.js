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

/* ===========================
   NORMALIZADOR ROBUSTO
=========================== */
function limpiar(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizarProducto(fila) {
  const res = {
    imagen: "",
    nombre: "",
    vendedor: "",
    precio: "",
    contacto: ""
  };

  for (const key in fila) {
    const k = limpiar(key);
    const value = (fila[key] || "").toString().trim();
    if (!value) continue;

    if (!res.imagen && (k.includes("imagen") || k.includes("foto"))) {
      res.imagen = value;
    }
    else if (!res.nombre && (k.includes("producto") || k.includes("titulo") || k.includes("nombre"))) {
      res.nombre = value;
    }
    else if (!res.vendedor && (k.includes("vendedor") || k.includes("autor") || k.includes("creador"))) {
      res.vendedor = value;
    }
    else if (!res.precio && (k.includes("precio") || k.includes("valor") || k.includes("costo"))) {
      res.precio = value;
    }
    else if (!res.contacto && (k.includes("contacto") || k.includes("whatsapp") || k.includes("instagram") || k.includes("ig"))) {
      res.contacto = value;
    }
  }

  return res;
}

/* ===========================
   FETCH Y RENDER
=========================== */
fetch(URL)
  .then(res => res.json())
  .then(data => {
    contenedor.innerHTML = "";

    if (!data || data.length === 0) {
      contenedor.innerHTML = "<p>No hay productos publicados.</p>";
      return;
    }

    data.reverse().forEach(fila => {
      const p = normalizarProducto(fila);

      const card = document.createElement("div");
      card.className = "product";

      // Imagen (sin validar extensión)
      let imgEl;
      if (p.imagen && p.imagen.startsWith("http")) {
        imgEl = document.createElement("img");
        imgEl.src = p.imagen;
        imgEl.alt = p.nombre || "Producto";
        imgEl.onerror = () => imgEl.replaceWith(createNoImg());
      } else {
        imgEl = createNoImg();
      }

      const h3 = document.createElement("h3");
      h3.textContent = p.nombre || "Sin título";

      const vendedor = document.createElement("p");
      vendedor.textContent = p.vendedor || "";

      const precio = document.createElement("p");
      precio.className = "price";
      precio.textContent = p.precio ? "$" + p.precio : "";

      const btn = document.createElement("a");
      btn.className = "btn ver-producto";
      btn.href = "#";
      btn.textContent = "Ver producto";

      card.append(imgEl, h3, vendedor, precio, btn);
      contenedor.appendChild(card);

      // Modal
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "block";

        modalImg.src = p.imagen || "";
        modalImg.onerror = () => modalImg.src = "";

        modalNombre.textContent = p.nombre || "";
        modalVendedor.textContent = "Vendedor: " + (p.vendedor || "");
        modalPrecio.textContent = p.precio ? "$" + p.precio : "";
        modalContacto.href = p.contacto || "#";
        modalContacto.target = "_blank";
      });
    });
  })
  .catch(err => {
    console.error(err);
    contenedor.innerHTML = "<p>Error cargando productos.</p>";
  });

/* ===========================
   CIERRES MODAL
=========================== */
spanClose.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.style.display = "none";
});

/* ===========================
   FALLBACK IMAGEN
=========================== */
function createNoImg() {
  const div = document.createElement("div");
  div.className = "no-img";
  div.textContent = "Imagen no disponible";
  return div;
}
