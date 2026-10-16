// Servidor del quiz en sala: node server.js  ->  http://localhost:3000 (sin dependencias)
const http=require('http'),fs=require('fs'),path=require('path');
const sala=require('./js/sala-api.js')(require('./js/sala-datos.js')),rooms={};
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg'};
http.createServer((req,res)=>{
 const u=new URL(req.url,'http://x');
 if(u.pathname.startsWith('/api/')){let b='';req.on('data',d=>b+=d);req.on('end',()=>{
  let j={};try{j=JSON.parse(b||'{}')}catch{}
  const o=sala(rooms,u.pathname.slice(5),req.method,u.searchParams,j);
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
