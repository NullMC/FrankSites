// We'll initialize UI parts once DOM is ready. Many DOM queries were at top-level and
// could throw if elements are missing; move them into DOMContentLoaded with guards.

function initLoaderAndParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    if (particlesContainer) {
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Controlla se il sito è già stato visitato in questa sessione
    const hasVisited = sessionStorage.getItem('siteVisited');
    const loaderEl = document.getElementById('loader-screen');
    const mainSiteEl = document.getElementById('main-site');

    if (!loaderEl || !mainSiteEl) return;

    if (hasVisited) {
        // Se già visitato, mostra direttamente il sito
        loaderEl.style.display = 'none';
        mainSiteEl.classList.add('visible');
    } else {
        // Prima visita della sessione, mostra il loader
        sessionStorage.setItem('siteVisited', 'true');

        // Timer per nascondere il loader dopo l'animazione
        setTimeout(function() {
            loaderEl.classList.add('fade-out');

            setTimeout(function() {
                loaderEl.style.display = 'none';
                mainSiteEl.classList.add('visible');
            }, 1000);
        }, 3500); // Attende che le animazioni finiscano
    }
}


function initThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        const body = document.body;
        if (!toggle) return;

        // initial state
        if (localStorage.getItem('theme') === 'dark') {
                body.classList.add('dark-mode');
                toggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
                // ensure correct icon on load
                toggle.innerHTML = body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }

        toggle.addEventListener('click', () => {
                body.classList.toggle('dark-mode');
                const isDark = body.classList.contains('dark-mode');
                toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
}

// FAQ Slider functionality
let currentFaqIndex = 0;
let faqContainer = null;
let faqDots = [];
let totalFaqs = 0;

function showFaq(index) {
    if (!faqContainer) return;
    currentFaqIndex = index;
    faqContainer.style.transform = `translateX(-${index * 100}%)`;

    faqDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextFaq() {
    const nextIndex = (currentFaqIndex + 1) % Math.max(totalFaqs, 1);
    showFaq(nextIndex);
}

function previousFaq() {
    const prevIndex = (currentFaqIndex - 1 + Math.max(totalFaqs, 1)) % Math.max(totalFaqs, 1);
    showFaq(prevIndex);
}

function setCurrentFaq(index) {
    showFaq(index);
}

function initFaqSlider() {
    faqContainer = document.getElementById('faqContainer');
    faqDots = Array.from(document.querySelectorAll('.faq-dot'));
    totalFaqs = faqContainer ? faqContainer.children.length : faqDots.length;

    if (!faqContainer || faqDots.length === 0) return;

    // Attach click handlers
    faqDots.forEach((dot, i) => {
        dot.addEventListener('click', () => setCurrentFaq(i));
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
// Header scroll effect: ensure header exists and toggle class rather than mixing inline styles
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;

    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all fade-in-up elements
document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Initialize body opacity
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

function updateScrollProgress() {
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    if (!scrollProgressBar) return;

    scrollProgressBar.style.width = `${Math.min(scrollProgress, 100)}%`;

    // Nascondi la barra quando si è in cima
    const progressContainer = document.querySelector('.scroll-progress');
    if (progressContainer) {
        if (scrollTop <= 50) {
            progressContainer.style.opacity = '0.5';
        } else {
            progressContainer.style.opacity = '1';
        }
    }
}

// Event listener per lo scroll
window.addEventListener('scroll', updateScrollProgress);

// Inizializza la barra al caricamento
document.addEventListener('DOMContentLoaded', updateScrollProgress);

class ParticleSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Verifica se il container esiste
        const container = document.getElementById('canvas-container');

        // Verifica se Three.js è caricato
        if (typeof THREE === 'undefined') {
            console.error('ERRORE: Three.js non è caricato! Aggiungi il CDN al tuo HTML.');
            return;
        }

        // Scena
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        container.appendChild(this.renderer.domElement);
        
        // Luci
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xff6b6b, 1, 100);
        pointLight.position.set(-5, 5, 0);
        this.scene.add(pointLight);

        console.log('Three.js inizializzato correttamente!');
    }

    createParticles() {
        const particleCount = 300; // Aumentato da 150 a 300
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for(let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 30;     // x - area leggermente più ampia
            positions[i + 1] = (Math.random() - 0.5) * 30; // y - area leggermente più ampia
            positions[i + 2] = (Math.random() - 0.5) * 30; // z - area leggermente più ampia
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.08, // Aumentato da 0.05 a 0.08
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;
        
        requestAnimationFrame(() => this.animate());
        
        // Animazione particelle con movimento fluido
        if (this.particles) {
            this.particles.rotation.x += 0.0005; // Velocità leggermente aumentata
            this.particles.rotation.y += 0.001;  // Velocità leggermente aumentata
            
            // Effetto leggero di movimento basato sul mouse
            this.particles.rotation.x += this.mouse.y * 0.0001;
            this.particles.rotation.y += this.mouse.x * 0.0001;
        }
        
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }
}

// Elementi DOM
const hamburger = document.getElementById('hamburger');
const offcanvas = document.getElementById('offcanvas');
const offcanvasOverlay = document.getElementById('offcanvasOverlay');
const offcanvasLinks = document.querySelectorAll('.offcanvas-nav a');

// Funzione per aprire l'offcanvas
function openOffcanvas() {
    hamburger.classList.add('active');
    offcanvas.classList.add('active');
    offcanvasOverlay.classList.add('active');
    document.body.classList.add('offcanvas-open');
}

// Funzione per chiudere l'offcanvas
function closeOffcanvas() {
    hamburger.classList.remove('active');
    offcanvas.classList.remove('active');
    offcanvasOverlay.classList.remove('active');
    document.body.classList.remove('offcanvas-open');
}

// Event listeners
hamburger.addEventListener('click', () => {
    if (offcanvas.classList.contains('active')) {
        closeOffcanvas();
    } else {
        openOffcanvas();
    }
});

// Chiudi cliccando sull'overlay
offcanvasOverlay.addEventListener('click', closeOffcanvas);

// Chiudi cliccando sui link di navigazione
offcanvasLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeOffcanvas();
        // Smooth scroll al target
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    });
});

// Chiudi con tasto ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && offcanvas.classList.contains('active')) {
        closeOffcanvas();
    }
});

// Gestisci ridimensionamento finestra
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && offcanvas.classList.contains('active')) {
        closeOffcanvas();
    }
});

// Prevent scroll when offcanvas is open
document.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('offcanvas-open') && 
        !offcanvas.contains(e.target)) {
        e.preventDefault();
    }
}, { passive: false });




// Inizializza quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM caricato, inizializzo componenti...');
    initLoaderAndParticles();
    initThemeToggle();
    initFaqSlider();

    // Initialize ParticleSystem only if canvas container exists and THREE is available
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer && typeof THREE !== 'undefined') {
        console.log('inizializzo ParticleSystem...');
        new ParticleSystem();
    } else if (canvasContainer) {
        console.error('Three.js non è disponibile. Aggiungi il CDN o bundle Three.js per vedere il canvas.');
    }
});