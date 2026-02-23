/* ═══════════════════════════════
   FrankSitez — script.js v2.0
═══════════════════════════════ */

/* ── LOADER & PARTICLES ── */
function initLoaderAndParticles() {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 10 + 's';
            p.style.animationDuration = (10 + Math.random() * 10) + 's';
            particlesContainer.appendChild(p);
        }
    }

    const hasVisited = sessionStorage.getItem('siteVisited');
    const loaderEl = document.getElementById('loader-screen');
    const mainSiteEl = document.getElementById('main-site');
    if (!loaderEl || !mainSiteEl) return;

    if (hasVisited) {
        loaderEl.style.display = 'none';
        mainSiteEl.classList.add('visible');
    } else {
        sessionStorage.setItem('siteVisited', 'true');
        setTimeout(() => {
            loaderEl.classList.add('fade-out');
            setTimeout(() => {
                loaderEl.style.display = 'none';
                mainSiteEl.classList.add('visible');
            }, 1000);
        }, 3500);
    }
}

/* ── THEME TOGGLE ── */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
    if (!toggle) return;

    const applyTheme = (isDark) => {
        body.classList.toggle('dark-mode', isDark);
        toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };

    const saved = localStorage.getItem('theme');
    applyTheme(saved === 'dark');

    toggle.addEventListener('click', () => {
        const isDark = !body.classList.contains('dark-mode');
        applyTheme(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

/* ── FAQ ACCORDION ── */
function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // close all
            items.forEach(i => i.classList.remove('open'));
            // open clicked if it wasn't open
            if (!isOpen) item.classList.add('open');
        });
    });
}

/* ── SCROLL PROGRESS ── */
function updateScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = Math.min((scrollTop / docHeight) * 100, 100) + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ── SCROLL-TRIGGERED FADE IN ── */
function initScrollObserver() {
    const els = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
}

/* ── SMOOTH ANCHOR SCROLL ── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ── MOBILE OFFCANVAS ── */
function initOffcanvas() {
    const hamburger = document.getElementById('hamburger');
    const offcanvas = document.getElementById('offcanvas');
    const overlay = document.getElementById('offcanvasOverlay');
    const links = document.querySelectorAll('.offcanvas-nav a');
    if (!hamburger || !offcanvas || !overlay) return;

    const open = () => {
        hamburger.classList.add('active');
        offcanvas.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        hamburger.classList.remove('active');
        offcanvas.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => offcanvas.classList.contains('active') ? close() : open());
    overlay.addEventListener('click', close);
    links.forEach(l => l.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 800) close(); });
}

/* ── THREE.JS PARTICLE SYSTEM ── */
class ParticleSystem {
    constructor() {
        this.scene = null; this.camera = null; this.renderer = null;
        this.particles = null; this.mouse = { x: 0, y: 0 };
        this.init();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }
    init() {
        const container = document.getElementById('canvas-container');
        if (!container || typeof THREE === 'undefined') return;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);
        const ambient = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambient);
    }
    createParticles() {
        if (!this.scene) return;
        const count = 200;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            pos[i]   = (Math.random() - 0.5) * 25;
            pos[i+1] = (Math.random() - 0.5) * 25;
            pos[i+2] = (Math.random() - 0.5) * 25;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ color: 0x14b8a6, size: 0.07, transparent: true, opacity: 0.6 });
        this.particles = new THREE.Points(geo, mat);
        this.scene.add(this.particles);
    }
    setupEventListeners() {
        window.addEventListener('resize', () => {
            if (!this.camera || !this.renderer) return;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        window.addEventListener('mousemove', e => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }
    animate() {
        if (!this.renderer) return;
        requestAnimationFrame(() => this.animate());
        if (this.particles) {
            this.particles.rotation.x += 0.0004;
            this.particles.rotation.y += 0.0008;
            this.particles.rotation.x += this.mouse.y * 0.00008;
            this.particles.rotation.y += this.mouse.x * 0.00008;
        }
        if (this.camera && this.scene) {
            this.camera.lookAt(this.scene.position);
            this.renderer.render(this.scene, this.camera);
        }
    }
}

/* ── BODY FADE-IN ── */
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

/* ── INIT ALL ── */
document.addEventListener('DOMContentLoaded', () => {
    initLoaderAndParticles();
    initThemeToggle();
    initFaqAccordion();
    initScrollObserver();
    initSmoothScroll();
    initOffcanvas();
    updateScrollProgress();

    const container = document.getElementById('canvas-container');
    if (container && typeof THREE !== 'undefined' && window.innerWidth > 800) {
        new ParticleSystem();
    }
});
