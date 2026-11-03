# FrankSitez — Portfolio

Portfolio personale realizzato con **React + Vite**, **Material UI**, **Bootstrap (grid)** e **Tailwind CSS (utilities)**.

## Avvio locale

```bash
npm install
npm run dev
```

## Build di produzione

```bash
npm run build
npm run preview
```

La build statica è generata in `dist/`. Per Cloudflare Pages usa il comando di build `npm run build` e directory di output `dist`. Per GitHub Pages è incluso un workflow di pubblicazione da `main`: abilita **Settings > Pages > Build and deployment > GitHub Actions** se non è già attivo.

## Architettura

- `src/App.jsx`: sezioni e componenti React, navigazione mobile, tema, FAQ.
- `src/content.js`: contenuti, link e progetti modificabili.
- `src/entry-server.jsx` + `scripts/prerender.mjs`: dopo `vite build` la pagina viene pre-renderizzata in `dist/index.html` (HTML completo per i motori di ricerca, stili MUI critici e dati strutturati schema.org generati da `content.js`).
- `src/styles.css`: design system responsive, carousel touch e filigrana animata a tutta larghezza.
- `src/components/TechScroller.jsx`: tecnologie in scorrimento continuo sotto le Soft Skills, con pausa al passaggio del mouse e rispetto del movimento ridotto.
- `public/static/CSS/IMGS/`: asset del portfolio, incluso il ritratto scontornato (`francesco.webp`) e l'immagine social `og-image.jpg` (1200×630).
- `public/robots.txt`, `public/sitemap.xml`: indicizzazione; aggiorna `lastmod` nella sitemap quando cambi i contenuti.

L'ordine rimane Home, Chi sono, Servizi, Portfolio, Competenze, FAQ e Contatti. Nessuna schermata di loading o dipendenza da Three.js.
