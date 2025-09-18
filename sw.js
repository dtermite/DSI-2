const CACHE_NAME = "dsi-cache-v7";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/style.min.css",
  "/script.min.js",
  "/manifest.json",
  "/images/Reporte Ventas.webp",
  "/images/Automatizacion Excel.webp",
  "/images/Reporte financiero.webp",
  "/images/Workflow.webp",
  "/images/Nuevo Logo DSI 2025.png",
  "/images/favicon.ico",
  "/images/og/home-og.svg",
  "/images/og/recursos-og.svg",
  "/images/og/automatizar-excel-ia-og.svg",
  "/images/og/kpis-dashboard-ventas-og.svg",
  "/images/og/workflow-ia-beneficios-og.svg",
  "/images/og/home-og.png",
  "/images/og/recursos-og.png",
  "/images/og/automatizar-excel-ia-og.png",
  "/images/og/kpis-dashboard-ventas-og.png",
  "/images/og/workflow-ia-beneficios-og.png",
  "/recursos/",
  "/recursos/index.html",
  "/recursos/automatizar-excel-ia.html",
  "/recursos/kpis-dashboard-ventas.html",
  "/recursos/workflow-ia-beneficios.html",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (c) => {
      for (const url of ASSETS) {
        try {
          const res = await fetch(url, { cache: "no-cache" });
          if (res.ok) await c.put(url, res.clone());
        } catch (_) {
          // Ignorar faltantes en build/dev; se cacheará on-demand en fetch
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches
        .match(e.request)
        .then(
          (r) =>
            r ||
            fetch(e.request)
              .then((res) => {
                const copy = res.clone();
                caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
                return res;
              })
              .catch(() => caches.match("/index.html"))
        )
    );
  }
});