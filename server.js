// Servidor del quiz en sala: node server.js  ->  http://localhost:3000 (sin dependencias)
const http=require('http'),fs=require('fs'),path=require('path');
const sala=require('./js/sala-api.js')(require('./js/sala-datos.js'));
const dataDir=process.env.DATA_DIR||path.resolve(__dirname,'..','.lsd-data');
const stateFile=path.join(dataDir,'rooms.json');
function loadRooms(){
 fs.mkdirSync(dataDir,{recursive:true});
 let state;
 try{state=JSON.parse(fs.readFileSync(stateFile,'utf8'))}
 catch(e){if(e.code==='ENOENT')return{};throw new Error(`No se pudieron cargar las salas guardadas en ${stateFile}: ${e.message}`,{cause:e})}
 if(!state||state.version!==1||!state.rooms||typeof state.rooms!=='object'||Array.isArray(state.rooms))
  throw new Error(`El archivo de salas guardadas tiene un formato no válido: ${stateFile}`);
 for(const [code,room] of Object.entries(state.rooms)){
  if(!/^[A-Z0-9]{5}$/.test(code)||!room||typeof room.key!=='string'||
   !['espera','en_curso','cerrada'].includes(room.estado)||!room.m||typeof room.m!=='object'||Array.isArray(room.m))
   throw new Error(`La sala guardada "${code}" tiene un formato no válido: ${stateFile}`);
 }
 return state.rooms
}
const rooms=loadRooms();
let saveSequence=0;
function saveRooms(){
 const tmp=`${stateFile}.${process.pid}.${++saveSequence}.tmp`;
 try{
  fs.writeFileSync(tmp,JSON.stringify({version:1,rooms}),{encoding:'utf8',mode:0o600,flag:'wx'});
  fs.renameSync(tmp,stateFile)
 }catch(e){
  try{fs.unlinkSync(tmp)}catch(cleanupError){if(cleanupError.code!=='ENOENT')console.error('No se pudo limpiar el archivo temporal de salas:',cleanupError)}
  throw e
 }
}
saveRooms();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg'};
http.createServer((req,res)=>{
 const u=new URL(req.url,'http://x');
 if(u.pathname.startsWith('/api/')){let b='';req.on('data',d=>b+=d);req.on('end',()=>{
  let j={};try{j=JSON.parse(b||'{}')}catch{}
  const route=u.pathname.slice(5),persist=req.method==='POST'&&['crear','unirse','cerrar','estado','respuestas'].includes(route);
  const previous=persist?JSON.stringify(rooms):null;
  let o=sala(rooms,route,req.method,u.searchParams,j);
  if(persist&&!o.s){
   try{saveRooms()}
   catch(e){
    for(const key of Object.keys(rooms))delete rooms[key];
    Object.assign(rooms,JSON.parse(previous));
    console.error('No se pudieron guardar las salas en almacenamiento persistente:',e);
    o={s:503,d:{error:'No se pudo guardar el cambio de forma permanente. No reinicies el servicio; inténtalo de nuevo o contacta al administrador.'}}
   }
  }
  res.writeHead(o.s||200,{'Content-Type':'application/json'});res.end(JSON.stringify(o.d))});return}
 let requestedPath;
 try{requestedPath=decodeURIComponent(u.pathname.slice(1))}catch{
  res.writeHead(400);return res.end('Ruta no válida')
 }
 const f=path.resolve(__dirname,requestedPath||'index.html');
 const relative=path.relative(__dirname,f);
 if(relative==='..'||relative.startsWith(`..${path.sep}`)||path.isAbsolute(relative)||relative.toLowerCase()==='server.js'){
  res.writeHead(404);return res.end()
 }
 fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);return res.end('No encontrado')}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});res.end(d)});
}).listen(port,host,()=>console.log('L.S.D en http://'+host+':'+port));
