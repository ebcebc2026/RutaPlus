const CLAVE = "naylssmx-favoritos";

function favoritos() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || []; }
  catch { return []; }
}

function guardarLista(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

function actualizarContadores() {
  document.querySelectorAll(".badge-favoritos").forEach(elemento => {
    elemento.textContent = favoritos().length;
  });
}

document.getElementById("anio").textContent = new Date().getFullYear();

const boton = document.getElementById("guardarDestacado");

function pintarBoton() {
  const guardado = favoritos().includes(1);
  boton.classList.toggle("guardado", guardado);
  boton.textContent = guardado ? "♥ Guardado" : "♡ Guardar";
}

boton.addEventListener("click", () => {
  const lista = favoritos();
  guardarLista(lista.includes(1) ? lista.filter(id => id !== 1) : [...lista, 1]);
  pintarBoton();
  actualizarContadores();
});

pintarBoton();
actualizarContadores();
