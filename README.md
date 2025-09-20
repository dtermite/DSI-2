# DSI-2 — Sitio estático de DSI (Del Sur Informática)

Sitio web estático con landing principal y sección de Recursos (artículos). Incluye optimizaciones de SEO, rendimiento e imágenes.

## Estructura del proyecto

```
.
├── images/                  # Imágenes del sitio (kebab-case, webp + png)
│   ├── automatizacion-excel.(webp|png)
│   ├── reporte-ventas.(webp|png)
│   ├── reporte-financiero.(webp|png)
│   ├── workflow.(webp|png)
│   ├── nuevo-logo-dsi-2025.(webp|png)
│   └── favicon.ico
├── recursos/                # Páginas de artículos
│   ├── index.html
│   ├── automatizar-excel-ia.html
│   ├── kpis-dashboard-ventas.html
│   └── workflow-ia-beneficios.html
├── index.html               # Landing principal
├── style.min.css            # CSS principal/minificado (producción)
├── script.js                # JS (edición)
├── script.min.js            # JS minificado (producción)
├── sitemap.xml              # Sitemap para buscadores
├── robots.txt               # Políticas de rastreo + referencia a sitemap.xml
├── manifest.json            # PWA (básico)
├── sw.js                    # Service Worker (si aplica)
└── .nojekyll                # Requerido para GitHub Pages
```

## Desarrollo local
- Abrí `index.html` directamente en el navegador o usá una extensión tipo “Live Server”.
- Editá JS en `script.js`. Para estilos, editá `style.min.css` directamente o configurá un pequeño pipeline para regenerar el minificado desde una hoja fuente (no incluido en este repo).
- Para producción, el sitio referencia `style.min.css` y `script.min.js`.

## Publicación en GitHub Pages
1) En GitHub → Settings → Pages
- Build and deployment → Source: “Deploy from a branch”
- Branch: `main`, Folder: `/ (root)`
- Guardar. Esperá 2–5 minutos.

2) URL pública
- Será algo como: `https://<tu-usuario>.github.io/DSI-2/`
- Verificá que las imágenes y enlaces funcionen (case-sensitive en producción).

## SEO y rendimiento
- Meta description y Open Graph: definidos en las páginas.
- `sitemap.xml` y `robots.txt`: ya configurados. Si cambiás rutas, actualizá `sitemap.xml` y sus fechas `lastmod`.
- Imágenes: usa `<picture>` con WebP + PNG fallback y `loading="lazy"`.
- Nombres de archivos: kebab-case, sin espacios ni acentos.
- Accesibilidad: `alt` descriptivo en las imágenes.
- CSS/JS: en producción se usa `.min`. Si editás, volvé a minificar (ver sección siguiente).

## Minificación rápida (opcional)
Si necesitás regenerar minificados (sin toolchain):
- CSS: podés usar un minificador online confiable o tu herramienta preferida. Guardá como `style.min.css`.
- JS: igual procedimiento → `script.min.js`.

## Solución de problemas
- Imágenes no se ven en “recursos/”: recordá que deben referenciar `../images/...` y respetar mayúsculas/minúsculas.
- 404 en producción: limpiar caché del navegador y verificar rutas relativas.
- OG/Twitter Cards no se actualizan: los bots cachean; probá depuradores (Facebook Sharing Debugger / Twitter Card Validator).

## Convenciones
- Rutas relativas consistentes (desde `recursos/` usar `../` para `images/` y CSS/JS).
- Mantener `kebab-case` para todos los nombres de archivos.
- Evitar espacios y tildes en nombres de archivos.

## Licencia
- Propiedad de DSI — Del Sur Informática.
