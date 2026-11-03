import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import './styles.css';
import App from './App.jsx';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Production HTML is prerendered at build time; the dev server serves an empty root.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
