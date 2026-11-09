// Captures the homepage of every project in src/content.js into public/static/CSS/IMGS/projects
// as <shot>-1440.webp and <shot>-800.webp. Needs a local Chrome (or set CHROME_PATH).
// Usage: npm run screenshots            (all projects)
//        npm run screenshots -- italfut (only the given `shot` names)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { projects } from '../src/content.js';

const outDir = new URL('../public/static/CSS/IMGS/projects/', import.meta.url);
const chrome = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome'
].find((candidate) => fs.existsSync(candidate));
if (!chrome) throw new Error('Chrome not found: set CHROME_PATH');

const only = process.argv.slice(2);
const targets = projects.filter((project) => !only.length || only.includes(project.shot));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const port = 9333;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'franksitez-shots-'));
const browser = spawn(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });

try {
  let page;
  for (let attempt = 0; attempt < 40 && !page; attempt++) {
    await sleep(250);
    try { page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch { /* not up yet */ }
  }
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve) => socket.addEventListener('open', resolve));
  let lastId = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  });
  const send = (method, params = {}) => new Promise((resolve) => {
    pending.set(++lastId, resolve);
    socket.send(JSON.stringify({ id: lastId, method, params }));
  });

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  // Choose the privacy-preserving option on cookie banners so they never end up in the shot.
  const declineCookies = `[...document.querySelectorAll('button, a')]
    .find((el) => /rifiuta|decline|reject|solo necessari|only necessary/i.test(el.textContent || ''))?.click()`;

  for (const project of targets) {
    await send('Page.navigate', { url: project.url });
    await sleep(7000); // let intro animations finish
    await send('Runtime.evaluate', { expression: declineCookies });
    await sleep(1500);
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
    await sleep(400);
    for (const width of [1440, 800]) {
      const clip = { x: 0, y: 0, width: 1440, height: 900, scale: width / 1440 };
      const { result } = await send('Page.captureScreenshot', { format: 'webp', quality: width > 1000 ? 76 : 72, clip });
      fs.writeFileSync(new URL(`${project.shot}-${width}.webp`, outDir), Buffer.from(result.data, 'base64'));
    }
    console.log('✓', project.title);
  }
  socket.close();
} finally {
  browser.kill();
  // Chrome can hold the profile for a moment after exit.
  await sleep(500);
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
}
