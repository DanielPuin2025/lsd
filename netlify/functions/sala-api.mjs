import { getStore } from "@netlify/blobs";
import salaApi from "../../js/sala-api.js";
import preguntas from "../../js/sala-datos.js";

const ejecutarSala = salaApi(preguntas);
const MAX_INTENTOS = 8;
const VIGENCIA_MS = 30 * 24 * 60 * 60 * 1000;

function respuesta(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function ejecutar(rooms, route, method, url, body) {
  return ejecutarSala(rooms, route, method, url.searchParams, body);
}

function esMutacion(route, method) {
  return route === "unirse" || route === "respuestas" ||
    (route === "cerrar" && method === "POST") ||
    (route === "estado" && method === "POST");
}

export default async function handler(request) {
  try {
    if (request.method !== "GET" && request.method !== "POST") {
      return respuesta({ error: "Método no permitido." }, 405);
    }

    const url = new URL(request.url);
    const route = url.pathname.replace(/\/+$/, "").split("/").pop();
    let body = {};

    if (request.method === "POST") {
      try {
        body = await request.json();
      } catch {
        return respuesta({ error: "La solicitud no contiene JSON válido." }, 400);
      }
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return respuesta({ error: "El contenido de la solicitud no es válido." }, 400);
      }
    }

    const store = getStore("lsd-salas");

    if (route === "crear") {
      for (let intento = 0; intento < MAX_INTENTOS; intento += 1) {
        const rooms = {};
        const result = ejecutar(rooms, route, request.method, url, body);
        const code = result.d.code;
        const closed = await store.getWithMetadata(`closed-room-${code}`, {
          type: "text",
        });
        if (closed?.metadata?.expiresAt > Date.now()) continue;
        if (closed) await store.delete(`closed-room-${code}`);
        const saved = await store.set(`room-${code}`, JSON.stringify(rooms[code]), {
          metadata: { expiresAt: Date.now() + VIGENCIA_MS },
          onlyIfNew: true,
        });
        if (saved.modified) return respuesta(result.d);
      }
      return respuesta({ error: "No se pudo crear la sala. Intenta de nuevo." }, 503);
    }

    const code = String(body.code || url.searchParams.get("code") || "")
      .trim()
      .toUpperCase();
    const key = `room-${code}`;
    const closedKey = `closed-room-${code}`;

    for (let intento = 0; intento < MAX_INTENTOS; intento += 1) {
      const closed = code
        ? await store.getWithMetadata(closedKey, { type: "text" })
        : null;
      if (closed?.metadata?.expiresAt > Date.now()) {
        return respuesta({ error: "La sala ya fue cerrada." }, 404);
      }
      if (closed) await store.delete(closedKey);

      const snapshot = code
        ? await store.getWithMetadata(key, { type: "json" })
        : null;
      if (snapshot?.metadata?.expiresAt <= Date.now()) {
        await store.delete(key);
        return respuesta({ error: "La sala venció. Pídele al admin que cree otra." }, 404);
      }
      const rooms = snapshot
        ? { [code]: JSON.parse(JSON.stringify(snapshot.data)) }
        : {};
      const result = ejecutar(rooms, route, request.method, url, body);

      if ((result.s || 200) >= 400 || !esMutacion(route, request.method)) {
        return respuesta(result.d, result.s || 200);
      }

      if (route === "cerrar") {
        const marked = await store.set(closedKey, JSON.stringify({ code }), {
          metadata: { expiresAt: Date.now() + VIGENCIA_MS },
          onlyIfNew: true,
        });
        if (!marked.modified) continue;
        await store.delete(key);
        return respuesta(result.d, result.s || 200);
      }

      const saved = await store.set(key, JSON.stringify(rooms[code]), {
        metadata: { expiresAt: Date.now() + VIGENCIA_MS },
        onlyIfMatch: snapshot.etag,
      });
      if (saved.modified) return respuesta(result.d, result.s || 200);
    }

    return respuesta(
      { error: "Hay varias acciones simultáneas. Intenta de nuevo." },
      409,
    );
  } catch (error) {
    console.error("Error en la API de salas de Netlify:", error);
    return respuesta({ error: "No se pudo procesar la solicitud de la sala." }, 500);
  }
}

export const config = {
  path: "/api/*",
};
