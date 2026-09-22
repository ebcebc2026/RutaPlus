document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#incidentForm");
  const defaultAlerts = [
    { id: "traffic-default", type: "Tráfico intenso", description: "Se reporta tráfico pesado en Periférico Norte.", location: "Periférico Norte", time: "Actualizado recientemente", style: "alert-danger", icon: "bi-car-front-fill", delay: "Retraso estimado: 15 minutos" },
    { id: "accident-default", type: "Accidente reportado", description: "Accidente cerca de la salida hacia Tlalnepantla. Hay una ruta alternativa disponible.", location: "Salida a Tlalnepantla", time: "Actualizado recientemente", style: "alert-warning", icon: "bi-exclamation-diamond-fill", alternative: true },
    { id: "works-default", type: "Obras", description: "Obras en el carril derecho; maneja con precaución.", location: "Av. López Mateos", time: "Actualizado recientemente", style: "alert-work", icon: "bi-cone-striped" }
  ];

  renderAlerts();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const incident = {
      id: `incident-${Date.now()}`,
      type: document.querySelector("#incidentType").value,
      description: document.querySelector("#incidentDescription").value.trim(),
      location: document.querySelector("#incidentLocation").value.trim() || "Ubicación no especificada",
      time: new Date().toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }),
      style: "alert-info",
      icon: "bi-megaphone-fill",
      userCreated: true
    };

    const incidents = getIncidents();
    incidents.unshift(incident);
    localStorage.setItem("rutaPlusIncidents", JSON.stringify(incidents));
    form.reset();
    form.classList.remove("was-validated");
    renderAlerts();
    showToast("Tu incidente se reportó correctamente.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelector("#alertsList").addEventListener("click", (event) => {
    const alternativeButton = event.target.closest("[data-alternative]");
    if (alternativeButton) {
      localStorage.setItem("rutaPlusSearch", JSON.stringify({ origin: "Cuautitlán Izcalli", destination: "Tlalnepantla", createdAt: new Date().toISOString() }));
      window.location.href = "rutas.html";
      return;
    }

    const deleteButton = event.target.closest("[data-delete]");
    if (!deleteButton) return;
    const incidents = getIncidents().filter(item => item.id !== deleteButton.dataset.delete);
    localStorage.setItem("rutaPlusIncidents", JSON.stringify(incidents));
    renderAlerts();
    showToast("El reporte se eliminó.");
  });

  function renderAlerts() {
    const alerts = [...getIncidents(), ...defaultAlerts];
    document.querySelector("#alertsList").innerHTML = alerts.map(alert => `
      <div class="col-md-6 col-xl-4">
        <article class="alert-card ${alert.style}">
          <div class="alert-top"><span class="alert-icon"><i class="bi ${alert.icon}"></i></span><div><h2>${escapeHtml(alert.type)}</h2><p>${escapeHtml(alert.description)}</p></div></div>
          <div class="alert-meta mt-3"><i class="bi bi-geo-alt"></i> ${escapeHtml(alert.location)}<br><i class="bi bi-clock"></i> ${escapeHtml(alert.time)}</div>
          ${alert.delay ? `<p class="fw-bold text-danger mt-3 mb-0">${escapeHtml(alert.delay)}</p>` : ""}
          ${alert.alternative ? '<button class="btn btn-primary btn-sm mt-3" type="button" data-alternative><i class="bi bi-signpost-split"></i> Ver alternativa</button>' : ""}
          ${alert.userCreated ? `<button class="btn btn-outline-danger btn-sm mt-3" type="button" data-delete="${escapeHtml(alert.id)}"><i class="bi bi-trash"></i> Eliminar reporte</button>` : ""}
        </article>
      </div>`).join("");
  }

  function getIncidents() { return JSON.parse(localStorage.getItem("rutaPlusIncidents") || "[]"); }
  function escapeHtml(value) { const element = document.createElement("div"); element.textContent = String(value); return element.innerHTML; }
  function showToast(message) { document.querySelector("#toastMessage").textContent = message; bootstrap.Toast.getOrCreateInstance(document.querySelector("#appToast")).show(); }
});
