# RadarPlanes · Hyperlocal Campus Express

> Red social universitaria para descubrir, crear y unirse a **planes en vivo**
> dentro y alrededor del campus en menos de 30 segundos.

Aplicación web **mobile-first** construida como **SPA** con **Vite + JavaScript
vanilla (ES2020+)**, **HTML5** y **CSS3** (sin frameworks de UI). El estado y la
persistencia se manejan con `localStorage` y `sessionStorage`, y el rendering
de las 5 vistas se hace con DOM nativo (`document.createElement`).

---

## Características

- 📡 **Radar en vivo** con mapa del campus, pines animados y selector de radio (500 m / 1 km / 3 km / 5 km).
- 🔍 **Filtros por categoría** (Pichanga, Cartas, Fiesta, Estudio) con conteo dinámico.
- ➕ **Lanzar Plan Express** — formulario con contador de caracteres, sugerencias, selector visual de categoría y stepper de cupos.
- 📋 **Mis Planes** — pestañas *Creados / Me Sumé* con gestión de cupos en tiempo real (– / +), pausar plan y modal de cancelación.
- 🗺️ **Ficha del plan + Cómo llegar** — hero, organizador verificado, ruta GPS dibujada en SVG y CTA RSVP.
- 🛡️ **Comunidad & Campus Seguro** — radio de proximidad interactivo, alerta exprés de pichangas, Protocolo Safe Student, perfil universitario SSO y enlace al repositorio.
- 📱 **100% responsive** — patrón *phone-frame* en desktop (`max-width: 540px` centrado) y bottom-nav fija en móvil con FAB central.
- 💾 **Persistencia local** de planes creados, cupos, radio, ordenamiento y categoría seleccionada.
- ⚡ **Sin frameworks de UI** — solo Vite como bundler y `Inter` / `Plus Jakarta Sans` / Material Symbols de Google Fonts.

---

## Stack

| Capa        | Tecnología                                |
|-------------|--------------------------------------------|
| Bundler     | [Vite 5](https://vitejs.dev)              |
| Lenguaje    | JavaScript ES2020+ (módulos nativos)        |
| Estilos     | CSS3 con variables, container-queries y `dvh` |
| Iconos      | [Material Symbols](https://fonts.google.com/icons) |
| Tipografía  | Inter + Plus Jakarta Sans (Google Fonts)  |
| Persistencia| `localStorage` / `sessionStorage`          |
| Hosting     | Estático — desplegable en GitHub Pages, Vercel, Netlify, etc. |

---

## Estructura

```
radarplanes/
├─ index.html               # Entry HTML (root Vite)
├─ vite.config.js           # Config del dev-server y build
├─ public/
│  └─ favicon.svg
├─ scripts/
│  ├─ snap.mjs              # Screenshots con device emulation (Puppeteer)
│  └─ snap.sh               # Wrapper de shell (legacy)
├─ screenshots/             # Capturas mobile + desktop para el informe
├─ src/
│  ├─ main.js               # Bootstrap + hash router + estado global
│  ├─ styles.css            # Design tokens + todos los estilos
│  ├─ data/
│  │  └─ plans.js           # Seed de planes + constantes (categorías, radios)
│  ├─ utils/
│  │  └─ dom.js             # helpers `el()`, `icon()`, `toast()`, `clear()`
│  ├─ components/
│  │  └─ nav.js             # TopHeader + BottomNav (FAB Lanzar)
│  └─ views/
│     ├─ radar.js           # Vista 1 · Radar en vivo (home)
│     ├─ lanzar.js          # Vista 2 · Lanzar Plan Express
│     ├─ mis-planes.js      # Vista 3 · Gestión de mis planes
│     ├─ detail.js          # Vista 4 · Ficha + Cómo llegar
│     └─ comunidad.js       # Vista 5 · Comunidad & Seguridad
└─ package.json
```

---

## Cómo ejecutar el proyecto

### 1) Requisitos

- **Node.js ≥ 18** y **npm ≥ 9**.

### 2) Instalar dependencias

```bash
cd radarplanes
npm install
```

### 3) Servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.
Vite hace **HMR** — cualquier cambio en `src/` se refleja al instante.

### 4) Build de producción

```bash
npm run build
```

Genera los estáticos optimizados en `dist/` (≈ 41 kB JS + 18 kB CSS, **gzip ~17 kB total**).

### 5) Previsualizar el build

```bash
npm run preview
```

Sirve la build en [http://localhost:4173](http://localhost:4173).

### 6) Tomar capturas (opcional)

```bash
npm run dev          # en una terminal
node scripts/snap.mjs # en otra (requiere puppeteer-core + Chrome)
```

Las capturas se guardan en `screenshots/` con emulación de viewport móvil y desktop.

---

## Navegación por hash

| URL                              | Vista                       |
|----------------------------------|----------------------------|
| `/#radar`                        | Radar en vivo (home)       |
| `/#lanzar`                       | Lanzar Plan Express        |
| `/#mis-planes`                   | Mis Planes                 |
| `/#comunidad`                    | Comunidad & Campus Seguro  |
| `/?plan=plan-1#radar`            | Ficha del plan `plan-1`    |

---

## Funcionalidades interactivas (JS dinámico)

- ✅ **Contador de caracteres** en tiempo real (`0/60`).
- ✅ **Stepper de cupos** (`+ / −`) con límites 2-20 y recálculo del %.
- ✅ **Switch de visibilidad** del plan (pausar / reanudar).
- ✅ **Toggle de alerta exprés** (persistente).
- ✅ **Selector de radio de proximidad** (500 m → 5 km) que cambia el anillo del radar.
- ✅ **Filtro por categoría** con recálculo de conteo.
- ✅ **Orden por distancia / urgencia** (toast feedback).
- ✅ **Modal de cancelación** con backdrop dismiss.
- ✅ **Toasts efímeros** (`showToast`) para confirmar acciones.
- ✅ **Crear plan** con persistencia en `localStorage` y redirección a *Mis Planes*.
- ✅ **Unirse / Salirse** de un plan con ajuste de cupos y feedback.
- ✅ **Cancelar plan** propio liberando cupos.

---

## Responsive

- **Mobile (≤ 480 px)** — `max-width: 100%` + bottom-nav fija con FAB.
- **Tablet / Desktop (> 900 px)** — el contenido se centra en un *phone-frame* de 540 px simulando una experiencia móvil premium; el fondo muestra gradientes radiales.

Probado en Chromium 120+ con `device-pixel-ratio: 2` para iPhone.

---

## Referencias

1. MDN Web Docs — *Mobile-first Responsive Design*.
   <https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first>
2. Vite — *Getting Started*.
   <https://vitejs.dev/guide/>
3. Google Material Design 3 — *Color System & Tokens*.
   <https://m3.material.io/styles/color/the-color-system/tokens>
5. Material Symbols (Google Fonts).
   <https://fonts.google.com/icons>
6. W3C — *CSS Custom Properties for Cascading Variables*.
   <https://www.w3.org/TR/css-variables-1/>
7. Puppeteer — *Device emulation for screenshots*.
   <https://pptr.dev/guides/device-emulation>

---

## Licencia

MIT — Hecho por estudiantes para estudiantes 🎓