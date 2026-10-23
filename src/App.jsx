import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ThemeProvider, createTheme, CssBaseline, Button, IconButton, Drawer,
  Typography, Chip, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  ArrowForwardRounded, ArrowOutwardRounded, MenuRounded, CloseRounded,
  LightModeOutlined, DarkModeOutlined, ChevronLeftRounded, ChevronRightRounded, AddRounded, EmailOutlined,
  PlaceOutlined, CheckRounded
} from '@mui/icons-material';
import { navigation, services, projects, softSkills, questions } from './content.js';
import TechScroller from './components/TechScroller.jsx';

const asset = (file) => import.meta.env.BASE_URL + 'static/CSS/IMGS/' + encodeURIComponent(file);

const frankProfile = JSON.stringify({
  name: 'Francesco',
  alias: 'Frank',
  location: 'Bari, Italy',
  role: ['Web Developer', 'Graphic Designer', 'Digital Partner'],
  specialization: ['Informatica', 'Telecomunicazioni', 'IoT & NFC'],
  available: true
}, null, 2);

function SectionTitle({ title, intro, inverse = false, id }) {
  return (
    <div className={'section-heading' + (inverse ? ' section-heading-inverse' : '')}>
      <h2 id={id}>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}


/**
 * Grid on desktop, swipeable native scroll-snap carousel on mobile.
 * Buttons are only shown on mobile; touch and keyboard scrolling work without JS.
 */
function CardCarousel({ className = '', label, children }) {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const updateEdges = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      setEdges({
        start: track.scrollLeft <= 3,
        end: track.scrollLeft >= maxScroll - 3
      });
    };

    updateEdges();
    track.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      track.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, []);

  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.mobile-carousel-slide');
    if (!card) return;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const distance = card.getBoundingClientRect().width + gap;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * distance, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="carousel-shell">
      <div className={className + ' mobile-carousel-track'} ref={trackRef} role="region"
        aria-roledescription="carousel" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <div className="mobile-carousel-controls" aria-label={'Controlli ' + label}>
        <IconButton onClick={() => move(-1)} disabled={edges.start} size="small" aria-label={'Card precedente, ' + label}>
          <ChevronLeftRounded />
        </IconButton>
        <IconButton onClick={() => move(1)} disabled={edges.end} size="small" aria-label={'Card successiva, ' + label}>
          <ChevronRightRounded />
        </IconButton>
      </div>
    </div>
  );
}

function Header({ mode, setMode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  const toggleTheme = (
    <IconButton aria-label={mode === 'light' ? 'Attiva tema scuro' : 'Attiva tema chiaro'}
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} className="theme-control" size="small">
      {mode === 'light' ? <DarkModeOutlined fontSize="small" /> : <LightModeOutlined fontSize="small" />}
    </IconButton>
  );

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner container flex items-center">
          <a className="brand" href="#hero" aria-label="FrankSitez, torna all'inizio">
            <img src={asset('logo.png')} alt="" width="38" height="38" />
            <span>Frank<span className="brand-accent">Sitez</span></span>
          </a>
          <nav className="desktop-links" aria-label="Navigazione principale">
            {navigation.slice(0, -1).map((item) => <a key={item.id} href={'#' + item.id}>{item.text}</a>)}
          </nav>
          <div className="header-actions">
            {toggleTheme}
            <Button component="a" href="#contact" className="header-cta" endIcon={<ArrowOutwardRounded />}>
              Collaboriamo
            </Button>
            <IconButton className="mobile-menu-button" aria-label="Apri menu" onClick={() => setOpen(true)}>
              <MenuRounded />
            </IconButton>
          </div>
        </div>
      </header>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}
        PaperProps={{ className: 'navigation-drawer' }}>
        <div className="drawer-head">
          <span className="drawer-brand">FrankSitez</span>
          <IconButton aria-label="Chiudi menu" onClick={() => setOpen(false)}><CloseRounded /></IconButton>
        </div>
        <nav aria-label="Navigazione mobile" className="drawer-links">
          {navigation.map((item) => (
            <a href={'#' + item.id} key={item.id} onClick={() => setOpen(false)}>
              {item.text}
            </a>
          ))}
        </nav>
        <div className="drawer-foot">Digital Partner · Bari, IT</div>
      </Drawer>
    </>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-title">
      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="hero-availability">Disponibile per nuovi progetti</p>
          <h1 id="hero-title">Ciao, sono<br /><span>Francesco</span></h1>
          <p className="hero-position">Sviluppatore Web &amp; Digital Partner</p>
          <p className="hero-description">Dalle idee alla realta,<br />Il tuo partner digitale a 360°.</p>
          <div className="hero-actions flex flex-wrap">
            <Button component="a" href="#contact" className="primary-action" endIcon={<ArrowOutwardRounded />}>Iniziamo</Button>
            <Button component="a" href="#portfolio" className="text-action" endIcon={<ArrowForwardRounded />}>Vedi i progetti</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section section-about" aria-labelledby="about-title">
      <div className="container">
        <SectionTitle id="about-title" title={<>Studente, sviluppatore,<br /><em>digital partner</em></>} />
        <div className="row gy-5 align-items-center">
          <div className="col-lg-6">
            <div className="about-copy">
              <p>Sono Francesco — Frank per gli amici. Dai vita alle tue idee! Con esperienza su progetti reali, progetto e sviluppo soluzioni digitali e innovative!</p>
              <p>Non mi limito a scrivere codice: collaboro con te per capire i tuoi obiettivi, definire una strategia e costruire la soluzione digitale e smart perfetta per te e la tua attività.</p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="code-window">
              <pre aria-label="Profilo professionale"><code>{frankProfile}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section services-section" id="services" aria-label="Servizi">
      <div className="container">
        <SectionTitle title={<>Cosa posso fare<br />per te</>} intro="Soluzioni smart su misura, dall'idea al deploy." />
        <CardCarousel className="row g-4" label="Servizi">
          {services.map((service) => (
              <div className="col-12 col-md-6 mobile-carousel-slide" key={service.title}>
                <article className="service-card">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="tag-row flex flex-wrap">{service.tags.map((tag) => <Chip key={tag} label={tag} size="small" className="minimal-chip" />)}</div>
                </article>
              </div>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-visual">
        <img loading="lazy" src={asset(project.image)} alt={'Logo del progetto ' + project.title} />
        <a className="project-visual-link" href={project.url} target="_blank" rel="noopener noreferrer"
          aria-label={'Visita il sito di ' + project.title}><ArrowOutwardRounded /></a>
      </div>
      <div className="project-meta">{project.year}</div>
      <h3><a href={project.url} target="_blank" rel="noopener noreferrer">{project.title}<ArrowOutwardRounded fontSize="small" /></a></h3>
      <p>{project.descriptionBefore}{project.partner && <a href={project.partner.url} target="_blank" rel="noopener noreferrer" className="inline-link">{project.partner.title}</a>}{project.descriptionAfter}{project.description}</p>
      <div className="tag-row">{project.tags.map((tag) => <Chip key={tag} size="small" className="project-tag" label={tag} />)}</div>
    </article>
  );
}

function Portfolio() {
  return (
    <section className="section portfolio-section" id="portfolio" aria-label="Portfolio progetti">
      <div className="container">
        <SectionTitle title="Portfolio progetti" />
        <CardCarousel className="row gx-4 gy-5" label="Progetti">
          {projects.map((project) => <div className="col-12 col-md-6 mobile-carousel-slide" key={project.title}><ProjectCard project={project} /></div>)}
        </CardCarousel>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section skills-section" id="skills" aria-label="Competenze">
      <div className="container">
        <SectionTitle title={<>Tecnologie &amp;<br />strumenti</>} intro="Le tecnologie con cui costruisco soluzioni." />
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="skill-panel">
              <div className="skill-panel-heading"><h3>Stack Tecnico</h3></div>
              <TechScroller />
            </div>
          </div>
          <div className="col-12 col-lg-5">
            <div className="skill-panel soft-panel">
              <div className="skill-panel-heading"><h3>Soft Skills</h3></div>
              <div className="soft-list">
                {softSkills.map((skill) => <div key={skill.title} className="soft-item"><div><h4>{skill.title}</h4><p>{skill.description}</p></div></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="section faq-section" id="faq" aria-label="Domande frequenti">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-lg-5">
            <SectionTitle title="Domande frequenti" intro="Tutto quello che devi sapere prima di iniziare a collaborare." />
          </div>
          <div className="col-12 col-lg-7">
            <div className="faq-accordion">
              {questions.map((entry, index) => (
                <Accordion key={entry.question} expanded={expanded === index} onChange={(_, isExpanded) => setExpanded(isExpanded ? index : false)} disableGutters elevation={0} square>
                  <AccordionSummary expandIcon={<AddRounded className="faq-plus" />} aria-controls={'faq-answer-' + index} id={'faq-question-' + index}>
                    <Typography component="h3" className="faq-question-text">{entry.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails id={'faq-answer-' + index}><Typography>{entry.answer}</Typography></AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section contact-section" id="contact" aria-label="Contatti">
      <div className="container">
        <div className="contact-shell">
          <div className="row gy-5 align-items-center">
            <div className="col-12 col-lg-7">
              <SectionTitle title={<>Pronto a<br />iniziare?</>} inverse />
              <p className="contact-description">Inviami i dettagli del tuo progetto: budget, numero di pagine e funzionalità desiderate. Ti risponderó appena possibile con un preventivo personalizzato.</p>
              <div className="contact-info">
                <div className="contact-info-row"><EmailOutlined /><div><span>Email</span><a href="mailto:lilnullbusiness@gmail.com">lilnullbusiness@gmail.com</a></div></div>
                <div className="contact-info-row"><PlaceOutlined /><div><span>Posizione</span><strong>Bari, Italia</strong></div></div>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="contact-card">
                <h3>Iniziamo a collaborare</h3>
                <p>Ogni grande progetto inizia con una conversazione.</p>
                <Button className="contact-button" component="a" href="https://it.fiverr.com/s/R7pNDZD" target="_blank"
                  rel="noopener noreferrer" endIcon={<ArrowOutwardRounded />}>Contattami ora</Button>
                <div className="contact-benefits"><span><CheckRounded fontSize="small" /> Preventivo gratuito</span><span><CheckRounded fontSize="small" /> Nessun impegno</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main flex items-center justify-between">
          <a className="brand" href="#hero" aria-label="Torna all'inizio"><img src={asset('logo.png')} alt="" width="35" height="35" /><span>Frank<span className="brand-accent">Sitez</span></span></a>
          <a href="#hero" className="back-to-top">Torna su ↑</a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Francesco · Tutti i diritti riservati</span>
          <span>Sviluppatore · Designer · Digital Partner · Bari, IT</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('franksitez-theme') === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
  });
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#0a9782' },
      background: { default: mode === 'dark' ? '#101818' : '#fafaf8' },
      text: { primary: mode === 'dark' ? '#f1f4f2' : '#15211f' }
    },
    typography: { fontFamily: 'DM Sans, sans-serif', button: { textTransform: 'none', fontWeight: 700 } },
    shape: { borderRadius: 12 },
    components: { MuiButton: { defaultProps: { disableElevation: true } }, MuiAccordion: { defaultProps: { disableGutters: true } } }
  }), [mode]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.style.colorScheme = mode;
    try { localStorage.setItem('franksitez-theme', mode); } catch { /* storage unavailable */ }
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <a className="skip-link" href="#about">Vai al contenuto</a>
      <Header mode={mode} setMode={setMode} />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Skills />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
