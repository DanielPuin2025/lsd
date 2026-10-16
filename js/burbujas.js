// ===== L.S.D · Personajes flotantes =====
// Cada personaje camina dentro de una burbuja iluminada, solo en la zona del título (inicio).
// Un clic muestra una frase corta (TIPS en js/datos.js) y se pueden arrastrar.

const COLORES={marihuana:'#34d399',lsd:'#a78bfa',hongos:'#f59e0b',cristal:'#38bdf8',
 tussi:'#f472b6',extasis:'#d946ef',pastillas:'#9ca3af',perico:'#7dd3fc'};
const capa=document.getElementById('burbujas');
const tam=()=>innerWidth<600?58:76;
const quieto=matchMedia('(prefers-reduced-motion: reduce)').matches;
const limitar=(v,max)=>Math.max(0,Math.min(max,v));

// Globo de texto compartido
const globo=document.createElement('div');
globo.className='tip';
capa.appendChild(globo);
let activa=null,temporizador;

// 1) Crear una burbuja por personaje
const burbujas=D.map((d,n)=>{
 const el=document.createElement('button');
 el.className='bub'+(quieto?' quieta':'');
 el.setAttribute('aria-label','Personaje '+d.n);
 el.style.setProperty('--c',COLORES[d.i]||'#8b5cf6');
 el.innerHTML=`<span class="flip"><span class="cuerpo"><img src="Images/${d.i}.png" alt="" style="animation-delay:${n*0.12}s" onerror="this.style.display='none'"></span></span>`;
 capa.appendChild(el);
 const T=tam(), v=()=>(0.3+Math.random()*0.4)*(Math.random()<.5?-1:1);
 const b={d,el,color:COLORES[d.i],tips:TIPS[d.i]||[d.q],i:-1,
  x:Math.random()*(capa.clientWidth-T),y:Math.random()*(capa.clientHeight-T),vx:v(),vy:v(),arrastra:false,movio:false};
 el.style.transform=`translate(${b.x}px,${b.y}px)`;
 return b;
});

// 2) Movimiento: caminan y rebotan en los bordes
function mover(){
 const T=tam(),W=capa.clientWidth-T,H=capa.clientHeight-T;
 burbujas.forEach(b=>{
  if(b.arrastra||b===activa)return;
  b.x+=b.vx;b.y+=b.vy;
  if(b.x<0||b.x>W){b.vx*=-1;b.x=limitar(b.x,W)}
  if(b.y<0||b.y>H){b.vy*=-1;b.y=limitar(b.y,H)}
  b.el.style.transform=`translate(${b.x}px,${b.y}px)`;
  b.el.classList.toggle('izq',b.vx<0);
 });
 requestAnimationFrame(mover);
}
if(!quieto)mover();

// 3) Clic: muestra una frase corta y pasa a la siguiente en el próximo clic
function colocar(){
 if(!activa)return;
 const T=tam();
 const x=limitar(activa.x+T/2-globo.offsetWidth/2,capa.clientWidth-globo.offsetWidth-8);
 let y=activa.y-globo.offsetHeight-12;
 if(y<8)y=activa.y+T+12;
 globo.style.transform=`translate(${Math.max(8,x)}px,${y}px)`;
}
function mostrar(b){
 b.i=(b.i+1)%b.tips.length;
 activa=b;
 globo.style.setProperty('--c',b.color);
 globo.innerHTML=`<b>${b.d.n}</b>${b.tips[b.i]}`;
 globo.classList.add('on');
 colocar();
 b.el.classList.add('salto');
 setTimeout(()=>b.el.classList.remove('salto'),400);
 reiniciar();
}
// El mensaje se oculta tras 10 segundos sin actividad
function reiniciar(){clearTimeout(temporizador);temporizador=setTimeout(cerrar,10000)}
function cerrar(){globo.classList.remove('on');activa=null}

// 4) Arrastrar (como las burbujas de Messenger); si no se mueve, cuenta como clic
burbujas.forEach(b=>{
 let sx,sy,ox,oy;
 b.el.addEventListener('pointerdown',e=>{
  b.arrastra=true;b.movio=false;sx=e.clientX;sy=e.clientY;ox=b.x;oy=b.y;
  b.el.setPointerCapture(e.pointerId);
 });
 b.el.addEventListener('pointermove',e=>{
  if(!b.arrastra)return;
  if(Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)>5)b.movio=true;
  if(b.movio){
   const T=tam();
   b.x=limitar(ox+e.clientX-sx,capa.clientWidth-T);b.y=limitar(oy+e.clientY-sy,capa.clientHeight-T);
   b.el.style.transform=`translate(${b.x}px,${b.y}px)`;colocar();reiniciar();
  }
 });
 b.el.addEventListener('pointerup',()=>{b.arrastra=false;if(!b.movio)mostrar(b)});
});
