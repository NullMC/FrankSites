// Runs after `vite build`: renders the app to static HTML inside dist/index.html.
import fs from 'node:fs/promises';
import { createServer } from 'vite';

const vite = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: 'error'
});

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');
  const { html, styles, head } = render();
  const file = new URL('../dist/index.html', import.meta.url);
  const template = await fs.readFile(file, 'utf8');
  if (!['<!--app-head-->', '<!--app-styles-->', '<div id="root"></div>'].every((marker) => template.includes(marker))) {
    throw new Error('Prerender placeholders not found in dist/index.html');
  }
  await fs.writeFile(file, template
    .replace('<!--app-head-->', head)
    .replace('<!--app-styles-->', styles)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`));
  console.log('Prerendered dist/index.html');
} finally {
  await vite.close();
}
