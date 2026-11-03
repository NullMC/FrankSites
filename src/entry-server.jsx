import { renderToString } from 'react-dom/server';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import App from './App.jsx';
import { services, projects, questions } from './content.js';

const SITE = 'https://franksitez.com/';
const EMAIL = 'lilnullbusiness@gmail.com';

// schema.org data built from the same content the page shows, so the two never drift apart.
function structuredData() {
  const person = {
    '@type': 'Person',
    '@id': SITE + '#francesco',
    name: 'Francesco',
    alternateName: 'Frank',
    jobTitle: 'Web Developer & Digital Partner',
    email: 'mailto:' + EMAIL,
    image: SITE + 'static/CSS/IMGS/og-image.jpg',
    url: SITE,
    address: { '@type': 'PostalAddress', addressLocality: 'Bari', addressRegion: 'Puglia', addressCountry: 'IT' },
    knowsAbout: [...new Set(services.flatMap((service) => service.tags))]
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': SITE + '#website', url: SITE, name: 'FrankSitez', inLanguage: 'it-IT', publisher: { '@id': person['@id'] } },
      person,
      {
        '@type': 'ProfessionalService',
        '@id': SITE + '#service',
        name: 'FrankSitez',
        url: SITE,
        image: SITE + 'static/CSS/IMGS/og-image.jpg',
        logo: SITE + 'static/CSS/IMGS/logo.png',
        email: EMAIL,
        founder: { '@id': person['@id'] },
        address: person.address,
        areaServed: [{ '@type': 'City', name: 'Bari' }, { '@type': 'Country', name: 'Italia' }],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Servizi',
          itemListElement: services.map((service) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: service.title, description: service.description }
          }))
        }
      },
      {
        '@type': 'ItemList',
        name: 'Progetti in evidenza',
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@type': 'CreativeWork', name: project.title, url: project.url, dateCreated: project.year, creator: { '@id': person['@id'] } }
        }))
      },
      {
        '@type': 'FAQPage',
        mainEntity: questions.map((entry) => ({
          '@type': 'Question',
          name: entry.question,
          acceptedAnswer: { '@type': 'Answer', text: entry.answer }
        }))
      }
    ]
  };
}

// Build-time render: static HTML for crawlers and first paint, plus the MUI critical styles.
// The 'css' key matches Emotion's default client cache so hydration reuses these styles.
export function render() {
  const cache = createCache({ key: 'css' });
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
  const html = renderToString(<CacheProvider value={cache}><App /></CacheProvider>);
  const styles = constructStyleTagsFromChunks(extractCriticalToChunks(html));
  const json = JSON.stringify(structuredData()).replace(/</g, '\\u003c');
  const head = `<script type="application/ld+json">${json}</script>`;
  return { html, styles, head };
}
