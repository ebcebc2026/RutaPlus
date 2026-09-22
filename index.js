document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#routeForm");
  const originInput = document.querySelector("#origin");
  const destinationInput = document.querySelector("#destination");
  const refreshButton = document.querySelector("#refreshInfo");

  const previousSearch = JSON.parse(localStorage.getItem("rutaPlusSearch") || "null");
  if (previousSearch) {
    originInput.value = previousSearch.origin || "";
    destinationInput.value = previousSearch.destination || "";
    document.querySelector("#mapOrigin").textContent = previousSearch.origin || "Cuautitlán Izcalli";
    document.querySelector("#mapDestination").textContent = previousSearch.destination || "Tlalnepantla";
  }

  originInput.addEventListener("input", updateMapLabels);
  destinationInput.addEventListener("input", updateMapLabels);

  updateAlertBadge();
  refreshButton.addEventListener("click", () => {
    updateQuickInfo();
    showToast("La información del trayecto se actualizó.");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const search = {
      origin: originInput.value.trim(),
      destination: destinationInput.value.trim(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("rutaPlusSearch", JSON.stringify(search));
    window.location.href = "rutas.html";
  });

  function updateQuickInfo() {
    const minutes = 32 + Math.floor(Math.random() * 9);
    const traffic = minutes >= 38 ? "Intenso" : minutes >= 35 ? "Moderado" : "Ligero";
    const departure = new Date(Date.now() + 20 * 60 * 1000);
    document.querySelector("#trafficValue").textContent = traffic;
    document.querySelector("#timeValue").textContent = `${minutes} min`;
    document.querySelector("#departureValue").textContent = departure.toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" });
  }

  function updateAlertBadge() {
    const count = JSON.parse(localStorage.getItem("rutaPlusIncidents") || "[]").length;
    const badge = document.querySelector("#alertBadge");
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove("d-none");
    }
  }

  function updateMapLabels() {
    document.querySelector("#mapOrigin").textContent = originInput.value.trim() || "Punto de salida";
    document.querySelector("#mapDestination").textContent = destinationInput.value.trim() || "Destino";
  }

  function showToast(message) {
    document.querySelector("#toastMessage").textContent = message;
    bootstrap.Toast.getOrCreateInstance(document.querySelector("#appToast")).show();
  }
});
