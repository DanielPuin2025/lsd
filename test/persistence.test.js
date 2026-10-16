const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const correctAnswers = require(path.join(root, 'js', 'sala-datos.js')).map(question => question.c);

async function getAvailablePort() {
 const server = http.createServer();
 server.listen(0, '127.0.0.1');
 await once(server, 'listening');
 const { port } = server.address();
 await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
 return port;
}

async function startServer(dataDir, port) {
 const child = spawn(process.execPath, [path.join(root, 'server.js')], {
  cwd: root,
  env: { ...process.env, DATA_DIR: dataDir, HOST: '127.0.0.1', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
 });
 let output = '';
 child.stdout.setEncoding('utf8').on('data', chunk => { output += chunk });
 child.stderr.setEncoding('utf8').on('data', chunk => { output += chunk });
 const exited = once(child, 'exit');
 const url = `http://127.0.0.1:${port}`;
 const deadline = Date.now() + 10000;
 while (Date.now() < deadline) {
  if (child.exitCode !== null) throw new Error(`El servidor salió antes de arrancar:\n${output}`);
  try {
   const response = await fetch(url);
   if (response.ok) return { child, exited, url };
  } catch {}
  await delay(100);
 }
 child.kill();
 await exited;
 throw new Error(`El servidor no respondió a tiempo:\n${output}`);
}

async function stopServer(server) {
 if (server.child.exitCode !== null) return;
 const exited = server.exited;
 server.child.kill();
 await exited;
}

async function post(url, route, payload) {
 return fetch(`${url}/api/${route}`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload)
 });
}

test('conserva sala y resultados cerrados después de reiniciar', async t => {
 const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lsd-persistence-'));
 const port = await getAvailablePort();
 let server;
 t.after(async () => {
  if (server) await stopServer(server);
  fs.rmSync(dataDir, { recursive: true, force: true });
 });

 server = await startServer(dataDir, port);
 const created = await post(server.url, 'crear', {});
 assert.equal(created.status, 200);
 const room = await created.json();

 const joined = await post(server.url, 'unirse', { code: room.code, nombre: 'Prueba de persistencia' });
 assert.equal(joined.status, 200);
 const participant = await joined.json();
 assert.equal((await post(server.url, 'estado', { code: room.code, key: room.key, estado: 'en_curso' })).status, 200);
 assert.equal((await post(server.url, 'respuestas', {
  code: room.code,
  pid: participant.pid,
  resp: correctAnswers
 })).status, 200);

 const closed = await post(server.url, 'cerrar', { code: room.code, key: room.key });
 assert.equal(closed.status, 200);
 const summary = await closed.json();
 assert.equal(summary.estado, 'cerrada');
 assert.equal(summary.personas, 1);
 assert.equal(summary.hechos, 1);

 await stopServer(server);
 server = await startServer(dataDir, port);
 const restored = await fetch(`${server.url}/api/admin?code=${room.code}&key=${room.key}`);
 assert.equal(restored.status, 200);
 assert.deepEqual(await restored.json(), summary);

 const participantState = await fetch(`${server.url}/api/estado?code=${room.code}&pid=${participant.pid}`);
 assert.equal(participantState.status, 200);
 const restoredParticipant = await participantState.json();
 assert.equal(restoredParticipant.estado, 'cerrada');
 assert.equal(restoredParticipant.yo.hecho, true);

 const stateFile = path.join(dataDir, 'rooms.json');
 assert.equal(JSON.parse(fs.readFileSync(stateFile, 'utf8')).rooms[room.code].estado, 'cerrada');
});
