const DISENOS = [
  {id:1,nombre:"Rosa cromado",estilo:"cromado",color:"rosa",forma:"almendra",largo:"mediano",imagen:"https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85"},
  {id:2,nombre:"French gráfico",estilo:"french",color:"blanco",forma:"almendra",largo:"mediano",imagen:"https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85"},
  {id:3,nombre:"Rosa intenso",estilo:"minimalista",color:"rosa",forma:"cuadrada",largo:"largo",imagen:"https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85"},
  {id:4,nombre:"Líneas plateadas",estilo:"cromado",color:"blanco",forma:"cuadrada",largo:"largo",imagen:"https://images.unsplash.com/photo-1604902396830-aca29e19b067?auto=format&fit=crop&w=900&q=85"},
  {id:5,nombre:"Flores de medianoche",estilo:"floral",color:"negro",forma:"almendra",largo:"largo",imagen:"https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85&sat=-45"},
  {id:6,nombre:"Corazones pequeños",estilo:"minimalista",color:"rojo",forma:"corta",largo:"corto",imagen:"https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85"},
  {id:7,nombre:"French lechoso",estilo:"french",color:"blanco",forma:"corta",largo:"corto",imagen:"https://images.unsplash.com/photo-1615412704911-55d589229864?auto=format&fit=crop&w=900&q=85"},
  {id:8,nombre:"Rojo terciopelo",estilo:"minimalista",color:"rojo",forma:"almendra",largo:"mediano",imagen:"https://images.unsplash.com/photo-1599206676335-193c82b13c9e?auto=format&fit=crop&w=900&q=85"}
];
const CLAVE = "naylssmx-favoritos";
const galeria = document.getElementById("galeria");
const galeriaGuardados = document.getElementById("galeriaGuardados");

function favoritos(){try{return JSON.parse(localStorage.getItem(CLAVE))||[]}catch{return[]}}
function guardarLista(lista){localStorage.setItem(CLAVE,JSON.stringify(lista))}
function esFavorito(id){return favoritos().includes(id)}

function tarjeta(diseno){
  const activo=esFavorito(diseno.id);
  return `<div class="col-6 col-md-4"><article class="tarjeta">
    <div class="imagen-tarjeta">
      <button class="guardar ${activo?"activo":""}" data-guardar="${diseno.id}" type="button" aria-label="Guardar diseño">${activo?"♥":"♡"}</button>
      <a href="detalle.html?id=${diseno.id}"><img src="${diseno.imagen}" alt="Diseño de uñas ${diseno.nombre}" loading="lazy"></a>
    </div>
    <h3>${diseno.nombre}</h3><p>${diseno.estilo} · ${diseno.color} · ${diseno.forma}</p>
  </article></div>`;
}

function enlazar(contenedor){
  contenedor.querySelectorAll("[data-guardar]").forEach(boton=>{
    boton.addEventListener("click",()=>{
      const id=Number(boton.dataset.guardar),lista=favoritos();
      guardarLista(lista.includes(id)?lista.filter(item=>item!==id):[...lista,id]);
      renderizar();
    });
  });
}

function resultados(){
  const texto=document.getElementById("buscar").value.trim().toLowerCase();
  const estilo=document.getElementById("estilo").value;
  const color=document.getElementById("color").value;
  const forma=document.getElementById("forma").value;
  return DISENOS.filter(d=>{
    const contenido=`${d.nombre} ${d.estilo} ${d.color} ${d.forma}`.toLowerCase();
    return(!texto||contenido.includes(texto))&&(estilo==="todos"||d.estilo===estilo)&&(color==="todos"||d.color===color)&&(forma==="todas"||d.forma===forma);
  });
}

function renderizar(){
  const lista=resultados();
  galeria.innerHTML=lista.map(tarjeta).join("");
  document.getElementById("cantidad").textContent=`${lista.length} diseños encontrados`;
  document.getElementById("sinResultados").classList.toggle("d-none",lista.length!==0);
  const guardados=DISENOS.filter(d=>favoritos().includes(d.id));
  galeriaGuardados.innerHTML=guardados.map(tarjeta).join("");
  document.getElementById("contador").textContent=guardados.length;
  document.getElementById("guardadosVacio").classList.toggle("d-none",guardados.length!==0);
  document.querySelectorAll(".badge-favoritos").forEach(e=>e.textContent=guardados.length);
  enlazar(galeria);enlazar(galeriaGuardados);
}

document.getElementById("formBusqueda").addEventListener("submit",e=>{e.preventDefault();renderizar()});
["buscar","estilo","color","forma"].forEach(id=>document.getElementById(id).addEventListener(id==="buscar"?"input":"change",renderizar));
document.getElementById("limpiar").addEventListener("click",()=>{
  document.getElementById("buscar").value="";
  document.getElementById("estilo").value="todos";
  document.getElementById("color").value="todos";
  document.getElementById("forma").value="todas";
  renderizar();
});
renderizar();
