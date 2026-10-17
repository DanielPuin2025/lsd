// ===== L.S.D · Lógica de la página principal =====
// Usa los datos de js/datos.js (D y Q)

// 1) Personajes: una tabla plegable (<details>) por cada elemento de D
const g=document.getElementById('chars');
D.forEach(d=>{g.insertAdjacentHTML('beforeend',`
<details class="char">
 <summary><img src="Images/${d.i}.png" alt="Personaje ${d.n}" onerror="this.style.display='none'"><span><b>${d.n}</b><small>${d.a}</small></span></summary>
 <table>
  <tr><th>¿Qué es?</th><td>${d.q}</td></tr>
  <tr><th>¿En qué afecta?</th><td>${d.f}</td></tr>
  <tr><th>Corto plazo</th><td>${d.t}</td></tr>
  <tr><th>Mediano plazo</th><td>${d.m}</td></tr>
  <tr><th>Largo plazo</th><td>${d.l}</td></tr>
 </table>
</details>`)});

// 2) Pantalla de carga y efecto máquina de escribir
function type(){
 const w="lsd";let k=0;const el=document.getElementById('tw');
 const iv=setInterval(()=>{el.textContent=w.slice(0,++k);if(k>=w.length){clearInterval(iv);
  setTimeout(()=>{['ttl','wl','cta'].forEach(id=>document.getElementById(id).classList.add('show'))},300)}},350);
}
window.addEventListener('load',()=>setTimeout(()=>{document.getElementById('loader').classList.add('hide');type()},2600));

// 3) Quiz interactivo
let qi=0,sc=0;
const $=id=>document.getElementById(id);
function show(){
 const x=Q[qi];$('prog').textContent=`Pregunta ${qi+1} de ${Q.length}`;$('qtxt').textContent=x.q;$('fb').textContent='';$('next').style.display='none';
 $('opts').innerHTML='';
 x.o.forEach((t,i)=>{const b=document.createElement('button');b.className='opt';b.textContent=t;b.onclick=()=>pick(i);$('opts').appendChild(b)});
}
function pick(i){
 const x=Q[qi],bs=[...document.querySelectorAll('.opt')];
 bs.forEach((b,j)=>{b.disabled=true;if(j===x.c)b.classList.add('ok');else if(j===i)b.classList.add('ko')});
 if(i===x.c)sc++;
 $('fb').textContent=(i===x.c?'¡Correcto! ':'Casi. ')+x.e;
 $('next').textContent=qi===Q.length-1?'Ver resultado':'Siguiente';$('next').style.display='inline-block';
}
$('next').onclick=()=>{
 qi++;
 if(qi<Q.length)show();
 else{$('prog').textContent='Resultado';$('qtxt').textContent=`Obtuviste ${sc} de ${Q.length}. ${sc>=4?'¡Excelente, estás muy bien informado!':'Sigue aprendiendo con los personajes de arriba.'}`;
  $('opts').innerHTML='';$('fb').textContent='';$('next').textContent='Reintentar';$('next').onclick=()=>{qi=0;sc=0;show()}}
};
show();

// 4) Secciones ocultas ("Acerca de" y "Marco legal"): solo se muestran al pulsar su opción del menú
function seccionOculta(enlace,seccion,cerrar){
 const sec=document.getElementById(seccion);
 document.querySelector('nav a[href="'+enlace+'"]').addEventListener('click',e=>{e.preventDefault();sec.hidden=false;sec.scrollIntoView({behavior:'smooth'})});
 document.getElementById(cerrar).onclick=()=>{sec.hidden=true;window.scrollTo({top:0,behavior:'smooth'})};
}
seccionOculta('#acerca','acerca','cerrar');
seccionOculta('#leyes','leyes','cerrar-leyes');

// 5) Mostrar u ocultar la información del creador
const creatorToggle=document.getElementById('creator-toggle');
const creatorDetails=document.getElementById('creator-details');
creatorToggle.addEventListener('click',()=>{
 const expanded=creatorToggle.getAttribute('aria-expanded')==='true';
 creatorDetails.hidden=expanded;
 creatorToggle.setAttribute('aria-expanded',String(!expanded));
 creatorToggle.textContent=expanded?'Conoce al creador':'Cerrar';
});

// 6) Menú sin "#" en la dirección: se desplaza suavemente sin cambiar la URL
document.querySelectorAll('a[href^="#"]').forEach(a=>{
 a.addEventListener('click',e=>{
  const destino=document.getElementById(a.getAttribute('href').slice(1));
  if(destino){e.preventDefault();destino.scrollIntoView({behavior:'smooth'})}
 });
});
