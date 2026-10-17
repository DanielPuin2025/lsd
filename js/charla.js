// ===== L.S.D · Lógica de la charla interactiva =====
// Usa los datos de js/charla-datos.js (CAT)

// Funciones de ayuda y estado del juego
const $=id=>document.getElementById(id), chat=$('chat'), ch=$('choices');
let pts=0, visited=new Set();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const scroll=()=>chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'});

function av(c){const k=c&&c.img;return `<div class="av"><img src="Images/${k}.png" alt="" onerror="this.style.display='none'"></div>`}
async function say(c,txt,who){
 const m=document.createElement('div');m.className='msg';
 m.innerHTML=av(c)+`<div class="bub"><small>${who}</small><span class="dots"><span></span><span></span><span></span></span></div>`;
 chat.appendChild(m);scroll();await wait(700);
 m.querySelector('.bub').innerHTML=`<small>${who}</small>${txt}`;scroll();await wait(500);
}
function you(t){const m=document.createElement('div');m.className='msg me';m.innerHTML=`<div class="bub">${t}</div>`;chat.appendChild(m);scroll()}
function opts(list){return new Promise(res=>{ch.innerHTML='';list.forEach((t,i)=>{const b=document.createElement('button');b.className='ch';b.innerHTML=t;b.onclick=()=>{res(i)};ch.appendChild(b)})})}
const guide={img:"lsd-favicon"};

// Menú: el guía ofrece las categorías que faltan
async function menu(){
 $('tag').textContent='Menú';
 if(visited.size===3){return fin()}
 await say(guide,visited.size?"¿Qué otra categoría quieres conocer?":"¡Hola! Soy tu guía de L.S.D. Las drogas se agrupan en <b>tres tipos</b> según cómo afectan al cuerpo. ¿Con cuál empezamos?","Guía");
 const keys=Object.keys(CAT).filter(k=>!visited.has(k));
 const i=await opts(keys.map(k=>`<img src="Images/${CAT[k].img}.png" alt="" onerror="this.style.display='none'"><span>${CAT[k].nom}</span>`));
 you(CAT[keys[i]].nom);ch.innerHTML='';
 await talk(keys[i]);
}
// Charla de una categoría: explica, hace una pregunta y vuelve al menú
async function talk(k){
 const c=CAT[k];$('tag').textContent=c.nom;
 await say(c,c.q,c.guia);
 await say(c,"<b>¿En qué afectan?</b> "+c.af,c.guia);
 await say(c,"<b>¿Cuáles son sus consecuencias?</b> "+c.co,c.guia);
 await say(c,"Una pregunta rápida: "+c.pr,c.guia);
 const i=await opts(c.op);ch.querySelectorAll('.ch').forEach((b,j)=>{b.disabled=true;if(j===c.ok)b.classList.add('ok');else if(j===i)b.classList.add('ko')});
 you(c.op[i]);
 if(i===c.ok){pts++;$('score').textContent='Puntos: '+pts;await say(c,"¡Correcto! "+c.ex,c.guia)}
 else await say(c,"Casi. "+c.ex,c.guia);
 visited.add(k);await wait(300);ch.innerHTML='';await menu();
}
// Final: muestra el puntaje y las líneas de ayuda
async function fin(){
 $('tag').textContent='Final';
 await say(guide,`¡Terminaste! Acertaste <b>${pts} de 3</b>. Recuerda: decir <b>no</b> es válido, y pedir ayuda siempre es una buena decisión.`,"Guía");
 await say(guide,"Si tú o alguien que conoces necesita apoyo, llama a la <b>Línea 141</b> (ICBF) o a la <b>Línea 106</b> (salud mental).","Guía");
 const i=await opts(["Jugar de nuevo","Volver a la página"]);
 if(i===0){location.reload()}else{restart()}
}
// Función para reiniciar la charla sin recargar
function restart(){
 pts=0;visited.clear();$('score').textContent='Puntos: 0';chat.innerHTML='';ch.innerHTML='';menu();
}
menu();
