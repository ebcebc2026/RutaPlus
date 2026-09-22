const DISENOS = [
  {id:1,nombre:"Rosa cromado",estilo:"Cromado",color:"Rosa",forma:"Almendra",largo:"Mediano",descripcion:"Un diseño suave con reflejos delicados que combina con cualquier ocasión.",imagen:"https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=85",paleta:["#efc9cf","#fff9f0","#c8c9cd"]},
  {id:2,nombre:"French gráfico",estilo:"French",color:"Blanco",forma:"Almendra",largo:"Mediano",descripcion:"Una versión moderna del French clásico con líneas limpias y pequeños detalles.",imagen:"https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=85",paleta:["#f8eee9","#ffffff","#242020"]},
  {id:3,nombre:"Rosa intenso",estilo:"Minimalista",color:"Rosa",forma:"Cuadrada",largo:"Largo",descripcion:"Color rosa brillante y forma cuadrada para un look sencillo con personalidad.",imagen:"https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85",paleta:["#f37ba8","#fbd1df","#fff7f2"]},
  {id:4,nombre:"Líneas plateadas",estilo:"Cromado",color:"Blanco",forma:"Cuadrada",largo:"Largo",descripcion:"Una base clara con detalles metálicos finos para un resultado elegante.",imagen:"https://images.unsplash.com/photo-1604902396830-aca29e19b067?auto=format&fit=crop&w=1200&q=85",paleta:["#ffffff","#d8d8dc","#8e9097"]},
  {id:5,nombre:"Flores de medianoche",estilo:"Floral",color:"Negro",forma:"Almendra",largo:"Largo",descripcion:"Flores delicadas sobre una base oscura para un diseño llamativo.",imagen:"https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85&sat=-45",paleta:["#1e1a1b","#8f6a73","#f3e5df"]},
  {id:6,nombre:"Corazones pequeños",estilo:"Minimalista",color:"Rojo",forma:"Corta",largo:"Corto",descripcion:"Una base natural con pequeños corazones rojos, ideal para todos los días.",imagen:"https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=85",paleta:["#f5d9d2","#a91f32","#fffaf5"]},
  {id:7,nombre:"French lechoso",estilo:"French",color:"Blanco",forma:"Corta",largo:"Corto",descripcion:"Puntas blancas sobre una base lechosa para un acabado clásico.",imagen:"https://images.unsplash.com/photo-1615412704911-55d589229864?auto=format&fit=crop&w=1200&q=85",paleta:["#fff","#f4e9e3","#d8c8c2"]},
  {id:8,nombre:"Rojo terciopelo",estilo:"Minimalista",color:"Rojo",forma:"Almendra",largo:"Mediano",descripcion:"Rojo profundo con acabado brillante para un diseño atemporal.",imagen:"https://images.unsplash.com/photo-1599206676335-193c82b13c9e?auto=format&fit=crop&w=1200&q=85",paleta:["#7b0d21","#ba233b","#f6dedc"]}
];
const CLAVE="naylssmx-favoritos";
const id=Number(new URLSearchParams(location.search).get("id"))||1;
const actual=DISENOS.find(d=>d.id===id)||DISENOS[0];
const boton=document.getElementById("guardarDetalle");

function favoritos(){try{return JSON.parse(localStorage.getItem(CLAVE))||[]}catch{return[]}}
function pintar(){
  const guardado=favoritos().includes(actual.id);
  boton.textContent=guardado?"♥ Diseño guardado":"♡ Guardar diseño";
  document.querySelectorAll(".badge-favoritos").forEach(e=>e.textContent=favoritos().length);
}

document.title=`${actual.nombre} | naylssmx`;
document.getElementById("imagenDetalle").src=actual.imagen;
document.getElementById("imagenDetalle").alt=`Diseño de uñas ${actual.nombre}`;
document.getElementById("nombreDetalle").textContent=actual.nombre;
document.getElementById("descripcionDetalle").textContent=actual.descripcion;
document.getElementById("colorDetalle").textContent=actual.color;
document.getElementById("estiloDetalle").textContent=actual.estilo;
document.getElementById("formaDetalle").textContent=actual.forma;
document.getElementById("largoDetalle").textContent=actual.largo;
document.getElementById("paletaDetalle").innerHTML=actual.paleta.map((color,i)=>`<span class="muestra"><i style="background:${color}"></i>${["Principal","Base","Detalle"][i]}</span>`).join("");

boton.addEventListener("click",()=>{
  const lista=favoritos();
  localStorage.setItem(CLAVE,JSON.stringify(lista.includes(actual.id)?lista.filter(item=>item!==actual.id):[...lista,actual.id]));
  pintar();
});

const relacionados=DISENOS.filter(d=>d.id!==actual.id).sort((a,b)=>Number(b.estilo===actual.estilo)-Number(a.estilo===actual.estilo)).slice(0,3);
document.getElementById("similares").innerHTML=relacionados.map(d=>`<div class="col-md-4"><article class="similar"><a href="detalle.html?id=${d.id}"><img src="${d.imagen}" alt="${d.nombre}"><h3>${d.nombre}</h3></a></article></div>`).join("");
pintar();
