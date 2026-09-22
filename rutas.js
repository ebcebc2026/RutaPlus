document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#routesSearchForm");
  const originInput = document.querySelector("#routeOrigin");
  const destinationInput = document.querySelector("#routeDestination");
  const typeSelect = document.querySelector("#routeType");
  let visibleRoutes = [];

  const previousSearch = JSON.parse(localStorage.getItem("rutaPlusSearch") || "null");
  if (previousSearch) {
    originInput.value = previousSearch.origin;
    destinationInput.value = previousSearch.destination;
  }

  searchRoutes();
  renderSavedRoutes();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    localStorage.setItem("rutaPlusSearch", JSON.stringify({ origin: originInput.value.trim(), destination: destinationInput.value.trim(), createdAt: new Date().toISOString() }));
    searchRoutes();
  });

  document.querySelector("#routeResults").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const route = visibleRoutes.find(item => item.id === button.dataset.id);
    if (!route) return;
    if (button.dataset.action === "view") showToast(`Ruta iniciada: llegarás aproximadamente a las ${route.arrival}.`);
    if (button.dataset.action === "save") saveRoute(route);
  });

  document.querySelector("#savedRoutes").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-remove]");
    if (!button) return;
    const saved = getSavedRoutes().filter(route => route.id !== button.dataset.remove);
    localStorage.setItem("rutaPlusSavedRoutes", JSON.stringify(saved));
    renderSavedRoutes();
    showToast("La ruta se eliminó de tus guardados.");
  });

  document.querySelector("#compareButton").addEventListener("click", renderComparison);

  function searchRoutes() {
    const origin = originInput.value.trim();
    const destination = destinationInput.value.trim();
    const seed = Math.max(1, (origin.length + destination.length) % 7);
    const baseMinutes = 31 + seed;
    const now = new Date();

    visibleRoutes = [
      { id: `recommended-${origin}-${destination}`, title: "Ruta recomendada", origin, destination, minutes: baseMinutes, distance: 19 + seed, traffic: "Moderado", type: "fast", recommended: true, arrival: getArrival(now, baseMinutes), recommendation: "Sal de 10 a 15 minutos antes." },
      { id: `alternative-${origin}-${destination}`, title: "Ruta alternativa", origin, destination, minutes: baseMinutes + 7, distance: 23 + seed, traffic: "Ligero", type: "light", recommended: false, arrival: getArrival(now, baseMinutes + 7), recommendation: "Menos tráfico, aunque la distancia es mayor." }
    ];

    if (typeSelect.value !== "all") visibleRoutes = visibleRoutes.filter(route => route.type === typeSelect.value);
    renderRoutes();
  }

  function renderRoutes() {
    const container = document.querySelector("#routeResults");
    if (!visibleRoutes.length) {
      container.innerHTML = '<div class="empty-state"><i class="bi bi-signpost-2 fs-1 d-block mb-2"></i>No hay rutas con este filtro.</div>';
      return;
    }
    container.innerHTML = visibleRoutes.map(route => `
      <article class="route-card ${route.recommended ? "recommended" : ""}">
        <div class="route-visual"><i class="bi bi-signpost-split-fill"></i></div>
        <div>
          ${route.recommended ? '<span class="badge text-bg-info mb-2">Recomendada</span>' : ''}
          <h2>${escapeHtml(route.title)}</h2>
          <p>${escapeHtml(route.origin)} <i class="bi bi-arrow-right"></i> ${escapeHtml(route.destination)}</p>
          <div class="route-metrics">
            <span class="metric"><i class="bi bi-clock"></i> <strong>${route.minutes} min</strong></span>
            <span class="metric"><i class="bi bi-signpost"></i> <strong>${route.distance} km</strong></span>
            <span class="metric"><i class="bi bi-car-front"></i> <span class="traffic-pill ${route.traffic === "Ligero" ? "traffic-light" : "traffic-moderate"}">${route.traffic}</span></span>
            <span class="metric"><i class="bi bi-flag"></i> Llegada: <strong>${route.arrival}</strong></span>
          </div>
          <p class="small mt-2 mb-0">${escapeHtml(route.recommendation)}</p>
        </div>
        <div class="route-actions">
          <button class="btn btn-primary" type="button" data-action="view" data-id="${escapeHtml(route.id)}"><i class="bi bi-arrow-right-circle"></i> Ver ruta</button>
          <button class="btn btn-outline-primary" type="button" data-action="save" data-id="${escapeHtml(route.id)}"><i class="bi bi-bookmark"></i> Guardar</button>
        </div>
      </article>`).join("");
  }

  function renderComparison() {
    const routes = visibleRoutes.length === 2 ? visibleRoutes : createAllRoutesForComparison();
    document.querySelector("#comparisonContent").innerHTML = `
      <div class="table-responsive"><table class="table table-hover align-middle mb-0">
        <thead><tr><th>Aspecto</th>${routes.map(route => `<th>${escapeHtml(route.title)}</th>`).join("")}</tr></thead>
        <tbody>
          <tr><th>Tiempo</th>${routes.map(route => `<td>${route.minutes} min</td>`).join("")}</tr>
          <tr><th>Distancia</th>${routes.map(route => `<td>${route.distance} km</td>`).join("")}</tr>
          <tr><th>Tráfico</th>${routes.map(route => `<td>${route.traffic}</td>`).join("")}</tr>
          <tr><th>Llegada estimada</th>${routes.map(route => `<td>${route.arrival}</td>`).join("")}</tr>
        </tbody>
      </table></div>`;
  }

  function createAllRoutesForComparison() {
    const selected = typeSelect.value;
    typeSelect.value = "all";
    searchRoutes();
    const routes = [...visibleRoutes];
    typeSelect.value = selected;
    if (selected !== "all") searchRoutes();
    return routes;
  }

  function saveRoute(route) {
    const saved = getSavedRoutes();
    if (saved.some(item => item.id === route.id)) {
      showToast("Esta ruta ya estaba guardada.");
      return;
    }
    saved.push(route);
    localStorage.setItem("rutaPlusSavedRoutes", JSON.stringify(saved));
    renderSavedRoutes();
    showToast("Ruta guardada correctamente.");
  }

  function renderSavedRoutes() {
    const saved = getSavedRoutes();
    document.querySelector("#savedCount").textContent = saved.length;
    document.querySelector("#savedRoutes").innerHTML = saved.length ? saved.map(route => `
      <div class="col-md-6"><article class="saved-route-card h-100 d-flex justify-content-between gap-3"><div><strong>${escapeHtml(route.origin)} → ${escapeHtml(route.destination)}</strong><small class="d-block text-secondary">${route.minutes} min · ${route.distance} km</small></div><button class="btn btn-sm btn-outline-danger" type="button" data-remove="${escapeHtml(route.id)}" aria-label="Eliminar ruta"><i class="bi bi-trash"></i></button></article></div>`).join("") : '<div class="col-12"><div class="empty-state py-4">Todavía no has guardado rutas.</div></div>';
  }

  function getSavedRoutes() { return JSON.parse(localStorage.getItem("rutaPlusSavedRoutes") || "[]"); }
  function getArrival(date, minutes) { const result = new Date(date.getTime() + minutes * 60000); return result.toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" }); }
  function escapeHtml(value) { const element = document.createElement("div"); element.textContent = String(value); return element.innerHTML; }
  function showToast(message) { document.querySelector("#toastMessage").textContent = message; bootstrap.Toast.getOrCreateInstance(document.querySelector("#appToast")).show(); }
});
