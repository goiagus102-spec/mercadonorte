const URL = "https://opensheet.elk.sh/1UmusFi6aUhxJ5xE1WfGMQ5s9DcZQ4Wx_UZw-h3-eVmI/Respuestas%20de%20formulario%201";

const contenedor = document.getElementById("productos");
contenedor.innerHTML = "<p>Cargando productos…</p>";

// Modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalNombre = document.getElementById("modal-nombre");
const modalTipo = document.getElementById("modal-tipo");
const modalDescripcion = document.getElementById("modal-descripcion");
const modalVendedor = document.getElementById("modal-vendedor");
const modalPrecio = document.getElementById("modal-precio");
const modalContacto = document.getElementById("modal-contacto");
const spanClose = document.querySelector(".modal-close");

/* ===========================
   UTILIDADES
=========================== */
function normalizarClave(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function obtenerCampo(fila, posibles) {
  for (const key in fila) {
    const keyNorm = normalizarClave(key);
    if (posibles.includes(keyNorm)) {
      return fila[key];
    }
  }
  return "";
}

/* ===========================
   NORMALIZADOR DEFINITIVO
=========================== */
function normalizarProducto(fila) {
  return {
    imagen: obtenerCampo(fila, [
      "linkdeimagen",
      "imagen",
      "imagendelproducto",
      "linkimagen"
    ]),
    nombre: obtenerCampo(fila, [
      "nombredelproducto",
      "producto",
      "nombre"
    ]),
    tipo: obtenerCampo(fila, [
      "tipodeproducto",
      "tipo",
      "categoria"
    ]),
    descripcion: obtenerCampo(fila, [
      "descripciondelproducto",
      "descripcion",
      "detalle"
    ]),
    vendedor: obtenerCampo(fila, [
      "nombredelvendedor",
      "vendedor"
    ]),
    precio: obtenerCampo(fila, [
      "precio",
      "valor"
    ]),
    contacto: obtenerCampo(fila, [
      "contacto",
      "linkdecontacto"
    ])
  };
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

      const tipoEl = document.createElement("p");
      tipoEl.className = "tipo";
      tipoEl.textContent = p.tipo || "";

      const descripcionEl = document.createElement("p");
      descripcionEl.className = "descripcion";
      descripcionEl.textContent = p.descripcion || "";

      const vendedor = document.createElement("p");
      vendedor.textContent = p.vendedor || "";

      const precio = document.createElement("p");
      precio.className = "price";
      precio.textContent = p.precio ? "$" + p.precio : "";

      const btn = document.createElement("a");
      btn.className = "btn ver-producto";
      btn.href = "#";
      btn.textContent = "Ver producto";

      card.append(imgEl, h3, tipoEl, descripcionEl, vendedor, precio, btn);
      contenedor.appendChild(card);

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "block";

        modalImg.src = p.imagen || "";
        modalNombre.textContent = p.nombre || "";
        modalTipo.textContent = "Tipo: " + (p.tipo || "");
        modalDescripcion.textContent = "Descripción: " + (p.descripcion || "");
        modalVendedor.textContent = "Vendedor: " + (p.vendedor || "");
        modalPrecio.textContent = p.precio ? "$" + p.precio : "";
        modalContacto.href = p.contacto || "#";
      });
    });
  })
  .catch(err => {
    console.error(err);
    contenedor.innerHTML = "<p>Error cargando productos.</p>";
  });

/* ===========================
   MODAL
=========================== */
spanClose.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
window.addEventListener("keydown", e => { if (e.key === "Escape") modal.style.display = "none"; });

function createNoImg() {
  const div = document.createElement("div");
  div.className = "no-img";
  div.textContent = "Imagen no disponible";
  return div;
}
