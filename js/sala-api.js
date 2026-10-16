// ===== Lógica de las salas: la usan server.js (varias personas) y, sin servidor, el navegador (modo local) =====
function salaApi(P){
 const POR_GRUPO=10,GRUPOS=5,rid=(n,a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789')=>Array.from({length:n},()=>a[Math.random()*a.length|0]).join('');
 const pts=x=>x.r.filter((v,i)=>v===P[i].c).length;
 const resumen=R=>{
  const ms=Object.values(R.m),fin=ms.filter(x=>x.r);
  const pq=P.map((p,i)=>({t:p.t,q:p.q,ok:fin.filter(x=>x.r[i]===p.c).length}));
  const temas={};pq.forEach(x=>{const t=temas[x.t]||(temas[x.t]={ok:0,tot:0});t.ok+=x.ok;t.tot+=fin.length});
  const grupos=[1,2,3,4,5].map(g=>{const a=ms.filter(x=>x.g===g),f=a.filter(x=>x.r);
   return{g,n:a.length,hechos:f.length,prom:f.length?+(f.reduce((s,x)=>s+pts(x),0)/f.length).toFixed(1):0}});
  const ranking=fin.map(x=>({n:x.n,g:x.g,pts:pts(x)})).sort((a,b)=>b.pts-a.pts);
  return{estado:R.estado,total:P.length,personas:ms.length,hechos:fin.length,pq,temas,grupos,ranking}
 };
 return function(rooms,r,m,q,j){
  const err=(s,msg)=>({s,d:{error:msg}});
  if(r==='crear'){let c;do c=rid(5);while(rooms[c]);rooms[c]={key:rid(16),estado:'espera',m:{}};return{d:{code:c,key:rooms[c].key}}}
  const code=String(j.code||q.get('code')||'').trim().toUpperCase(),R=rooms[code];
  if(!R)return err(404,'No existe esa sala. Revisa el código.');
  if(r==='unirse'){
   if(R.estado==='cerrada')return err(409,'La sala está cerrada.');
   const n=String(j.nombre||'').trim().slice(0,30),ms=Object.values(R.m);
   if(!n)return err(400,'Escribe tu nombre.');
   if(ms.length>=POR_GRUPO*GRUPOS)return err(409,'La sala está llena (5 grupos de 10).');
   const id=rid(10),g=Math.floor(ms.length/POR_GRUPO)+1;R.m[id]={n,g,r:null};
   return{d:{pid:id,grupo:g,nombre:n}}}
  if(r==='cerrar'&&m==='POST'){
   if(j.key!==R.key)return err(403,'Sin permiso.');
   R.estado='cerrada';
   return{d:resumen(R)}}
  if(r==='estado'&&m==='POST'){
   if(j.key!==R.key)return err(403,'Sin permiso.');
   if(R.estado==='cerrada'&&j.estado!=='cerrada')return err(409,'El quiz ya está cerrado.');
   if(['espera','en_curso','cerrada'].includes(j.estado))R.estado=j.estado;return{d:{estado:R.estado}}}
  if(r==='estado'){const p=R.m[q.get('pid')];return{d:{estado:R.estado,total:P.length,yo:p?{n:p.n,g:p.g,hecho:!!p.r}:null}}}
  if(r==='respuestas'){
   const p=R.m[j.pid];if(!p)return err(404,'No estás en esta sala.');
   if(R.estado!=='en_curso'&&!p.r)return err(409,'El admin cerró el quiz.');
   if(!p.r)p.r=P.map((_,i)=>Number(j.resp&&j.resp[i]));return{d:{ok:1}}}
  if(r==='admin'){
   if(String(q.get('key')).toUpperCase()!==R.key)return err(403,'Clave de admin incorrecta.');
   return{d:resumen(R)}}
  return err(404,'Ruta no encontrada.');
 }}
if(typeof module!=='undefined')module.exports=salaApi;
