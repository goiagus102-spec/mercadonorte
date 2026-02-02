alert("JS CARGADO");
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
        <a class="btn" href="${p["Contacto"] || "#"}" target="_blank">Contactar</a>
      `;

      contenedor.appendChild(card);
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
