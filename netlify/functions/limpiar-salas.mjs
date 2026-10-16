import { getStore } from "@netlify/blobs";

export default async function handler() {
  const store = getStore("lsd-salas");
  let eliminadas = 0;

  for (const prefix of ["room-", "closed-room-"]) {
    for await (const page of store.list({ prefix, paginate: true })) {
      for (const blob of page.blobs) {
        const entry = await store.getWithMetadata(blob.key);
        const expiresAt = entry?.metadata?.expiresAt;
        if (typeof expiresAt === "number" && expiresAt <= Date.now()) {
          await store.delete(blob.key);
          eliminadas += 1;
        }
      }
    }
  }

  console.log(`Salas vencidas eliminadas: ${eliminadas}`);
  return new Response("Limpieza completada.");
}

export const config = {
  schedule: "0 4 * * *",
};
