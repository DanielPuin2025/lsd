// ===== L.S.D · Sala y examen dentro de index.html (usa PREGS, salaApi y server.js) =====
(()=>{
const $=id=>document.getElementById(id), SALA=salaApi(PREGS);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ver=v=>document.querySelectorAll('#sala-box .sv').forEach(e=>e.hidden=e.id!==v);
const pc=(a,b)=>b?Math.round(a/b*100):0, bar=p=>`<div class="pbar"><i style="width:${p}%"></i></div>`;
let S=JSON.parse(localStorage.getItem('lsd-sala')||'null'),timer,iniciado=false,resp=[],local=false,sinRegistro=0;
const guardar=s=>{S=s;localStorage.setItem('lsd-sala',JSON.stringify(s))};

// Con servidor (node server.js) funciona entre varias personas; sin servidor usa el navegador (modo local)
async function api(ruta,cuerpo){
 const entornoLocal=location.protocol==='file:'||['localhost','127.0.0.1','::1'].includes(location.hostname);
 if(!local){let r;try{r=await fetch('/api/'+ruta,cuerpo?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(cuerpo)}:{})}catch{
   if(!entornoLocal)throw new Error('No se pudo conectar con el servidor de salas.');
   local=true
  }
  if(r){if((r.headers.get('content-type')||'').includes('json')){const d=await r.json();if(!r.ok)throw new Error(d.error);return d}
   if(!entornoLocal)throw new Error('El servidor de salas no respondió correctamente.');
   local=true
  }}
 $('s-local').hidden=false;
 const [p,qs]=ruta.split('?'),R=JSON.parse(localStorage.getItem('lsd-rooms')||'{}');
 const o=SALA(R,p,cuerpo?'POST':'GET',new URLSearchParams(qs||''),cuerpo||{});
 localStorage.setItem('lsd-rooms',JSON.stringify(R));
 if(o.s>=400)throw new Error(o.d.error);return o.d}

// ---- Inicio: soy admin / soy integrante ----
const rol=r=>{$('s-fadmin').hidden=r!=='a';$('s-fint').hidden=r!=='i';$('s-err').textContent=''};
const fallo=e=>$('s-err').textContent=e.message;
$('s-radmin').onclick=()=>rol('a');$('s-rint').onclick=()=>rol('i');
$('s-crear').onclick=async()=>{try{const d=await api('crear',{});guardar({code:d.code,key:d.key});entrar()}catch(e){fallo(e)}};
$('s-adin').onclick=async()=>{try{
 const code=$('s-acod2').value.trim().toUpperCase(),key=$('s-akey2').value.trim().toUpperCase();
 await api(`admin?code=${code}&key=${key}`);guardar({code,key});entrar()}catch(e){fallo(e)}};
$('s-unir').onclick=async()=>{try{
 const code=$('s-cod').value.trim().toUpperCase(),d=await api('unirse',{code,nombre:$('s-nom').value});
 guardar({code,pid:d.pid});entrar()}catch(e){fallo(e)}};
$('s-salir').onclick=()=>{localStorage.removeItem('lsd-sala');S=null;iniciado=false;entrar()};

function entrar(){
 clearInterval(timer);$('s-salir').hidden=!S;if(!S)return ver('s-inicio');
 if(S.key){ver('s-admin');$('s-acod').textContent=S.code;$('s-akey').textContent=S.key;
  if(S.cerrado){mostrarPanel(S.cerrado);return}
  panel();timer=setInterval(panel,2000)}
 else{sinRegistro=0;ver('s-esp');$('s-ecod').textContent=S.code;espera();timer=setInterval(espera,2000)}
}

// ---- Admin ----
$('s-ini').onclick=async()=>{
 $('s-ini').disabled=true;
 try{
  await api('estado',{code:S.code,key:S.key,estado:'en_curso'});
  await panel()
 }catch(e){
  $('s-res').innerHTML=`<p class="serr">${esc(e.message)}</p>`;
  $('s-ini').disabled=false
 }
};
$('s-cer').onclick=async()=>{
 $('s-cer').disabled=true;
 try{
  const d=await api('cerrar',{code:S.code,key:S.key});
  clearInterval(timer);guardar({...S,cerrado:d});mostrarPanel(d)
 }catch(e){$('s-res').innerHTML=`<p class="serr">${esc(e.message)}</p>`;$('s-cer').disabled=false}
};
async function panel(){
 try{mostrarPanel(await api(`admin?code=${S.code}&key=${S.key}`))}
 catch(e){$('s-res').innerHTML=`<p class="serr">${esc(e.message)}</p>`;clearInterval(timer)}
}
function mostrarPanel(d){
  $('s-ini').disabled=d.estado==='en_curso'||d.estado==='cerrada';$('s-cer').disabled=d.estado==='cerrada';
  const est={espera:'Esperando para iniciar',en_curso:'Quiz en curso',cerrada:'Quiz cerrado'}[d.estado];
  const tem=Object.entries(d.temas).map(([t,x])=>`<div class="fr"><span>${t}: <b>${pc(x.ok,x.tot)}%</b> de aciertos</span>${bar(pc(x.ok,x.tot))}</div>`).join('');
  const pq=d.pq.map(x=>({...x,p:pc(x.ok,d.hechos)})).sort((a,b)=>b.p-a.p);
  const li=a=>a.map(x=>`<li>${esc(x.q)} <b>(${x.p}%)</b></li>`).join('');
  const an=d.hechos?`<h3>Se destacaron en</h3><ul class="sbien">${li(pq.slice(0,3))}</ul><h3>Fallaron en (hay que reforzar)</h3><ul class="smal">${li(pq.slice(-3).reverse())}</ul>`:'<p class="sm">Aún no hay resultados.</p>';
  $('s-res').innerHTML=`<p><b>${est}</b> · ${d.personas} en la sala · ${d.hechos} terminaron</p>
  <h3>Por tema</h3>${d.hechos?tem:'<p class="sm">Sin datos todavía.</p>'}${an}
  <h3>Grupos</h3><table class="stab"><tr><th>Grupo</th><th>Personas</th><th>Terminaron</th><th>Promedio (de ${d.total})</th></tr>
  ${d.grupos.filter(g=>g.n).map(g=>`<tr><td>Grupo ${g.g}</td><td>${g.n}/10</td><td>${g.hechos}</td><td>${g.prom}</td></tr>`).join('')||'<tr><td colspan="4">Nadie se ha unido.</td></tr>'}</table>
  <h3>Ranking</h3><table class="stab">${d.ranking.slice(0,10).map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.n)}</td><td>Grupo ${x.g}</td><td>${x.pts}/${d.total}</td></tr>`).join('')||'<tr><td>Sin resultados.</td></tr>'}</table>`;
}

// ---- Integrante: sala de espera ----
async function espera(){
 try{const d=await api(`estado?code=${S.code}&pid=${S.pid}`);
  if(!d.yo){
   sinRegistro++;
   $('s-go').hidden=true;
   $('s-emsg').textContent=sinRegistro<3
    ?'Confirmando tu ingreso a la sala…'
    :'No encontramos tu registro en esta sala. Pulsa «Salir de la sala» y vuelve a entrar con el código.';
   if(sinRegistro>=3)clearInterval(timer);
   return
  }
  sinRegistro=0;
  $('s-enom').textContent=d.yo.n;$('s-egru').textContent='Grupo '+d.yo.g;
  if(d.yo.hecho){$('s-emsg').textContent='Ya enviaste tus respuestas. Gracias por participar.';$('s-go').hidden=true}
  else if(d.estado==='en_curso'){$('s-emsg').textContent='¡El quiz ya empezó!';$('s-go').hidden=false}
  else if(d.estado==='cerrada')$('s-emsg').textContent='El quiz está cerrado.';
 }catch(e){
  $('s-go').hidden=true;
   const salaCerrada=e.message.startsWith('No existe esa sala.')||e.message.startsWith('La sala ya fue cerrada.');
   $('s-emsg').textContent=salaCerrada
    ?'El admin cerró y eliminó la sala. Pulsa «Salir de la sala» para volver.'
    :e.message;
   if(salaCerrada)clearInterval(timer)
  }
 }
$('s-go').onclick=()=>{clearInterval(timer);iniciado=true;resp=[];pregunta(0)};

// ---- Examen (mismo formato que el quiz de la página) ----
function pregunta(i){
 ver('s-quiz');const p=PREGS[i];
 $('s-prog').textContent=`Pregunta ${i+1} de ${PREGS.length} · ${p.t}`;$('s-qtxt').textContent=p.q;$('s-fb').textContent='';$('s-next').style.display='none';$('s-opts').innerHTML='';
 p.o.forEach((t,j)=>{const b=document.createElement('button');b.className='opt';b.textContent=t;
  b.onclick=()=>{resp[i]=j;[...$('s-opts').children].forEach((x,k)=>{x.disabled=true;if(k===p.c)x.classList.add('ok');else if(k===j)x.classList.add('ko')});
   $('s-fb').textContent=(j===p.c?'¡Correcto! ':'Casi. ')+p.e;
   $('s-next').textContent=i===PREGS.length-1?'Ver resultado':'Siguiente';$('s-next').style.display='inline-block';
   $('s-next').onclick=()=>i<PREGS.length-1?pregunta(i+1):terminar()};
  $('s-opts').appendChild(b)});
}
async function terminar(){
 try{await api('respuestas',{code:S.code,pid:S.pid,resp})}catch(e){alert(e.message)}
 ver('s-fin');const ok=PREGS.filter((p,i)=>resp[i]===p.c).length;
 $('s-pts').innerHTML=`Acertaste <b>${ok} de ${PREGS.length}</b>. ${ok>=7?'¡Excelente, estás muy bien informado!':'Repasa la charla y los personajes.'}`;
 const t={};PREGS.forEach((p,i)=>{const x=t[p.t]||(t[p.t]={ok:0,n:0});x.n++;if(resp[i]===p.c)x.ok++});
 $('s-tem').innerHTML=Object.entries(t).map(([k,x])=>`<div class="fr"><span>${k}: ${x.ok}/${x.n}</span>${bar(pc(x.ok,x.n))}</div>`).join('');
}
entrar();
})();
