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


    const hasVisited = sessionStorage.getItem('siteVisited');
    const loaderEl = document.getElementById('loader-screen');
    const mainSiteEl = document.getElementById('main-site');

    if (!loaderEl || !mainSiteEl) return;

    if (hasVisited) {
        
        loaderEl.style.display = 'none';
        mainSiteEl.classList.add('visible');
    } else {
        
        sessionStorage.setItem('siteVisited', 'true');

        
        setTimeout(function() {
            loaderEl.classList.add('fade-out');

            setTimeout(function() {
                loaderEl.style.display = 'none';
                mainSiteEl.classList.add('visible');
            }, 1000);
        }, 3500);
    }
}


function initThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        const body = document.body;
        if (!toggle) return;

        
        if (localStorage.getItem('theme') === 'dark') {
                body.classList.add('dark-mode');
                toggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
                
                toggle.innerHTML = body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }

        toggle.addEventListener('click', () => {
                body.classList.toggle('dark-mode');
                const isDark = body.classList.contains('dark-mode');
                toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
}

function initFaqSlider() {
    const faqContainer = document.getElementById('faqContainer');
    const faqDotsContainer = document.getElementById('faqDotsContainer');
    const prevButton = document.getElementById('faqPrev');
    const nextButton = document.getElementById('faqNext');

    if (!faqContainer || !faqDotsContainer || !prevButton || !nextButton) {
        console.warn('Elementi dello slider FAQ non trovati.');
        return;
    }

    let currentFaqIndex = 0;
    const faqCards = faqContainer.children;
    const totalFaqs = faqCards.length;
    let faqDots = [];

    
    faqDotsContainer.innerHTML = '';
    for (let i = 0; i < totalFaqs; i++) {
        const dot = document.createElement('div');
        dot.className = 'faq-dot';
        dot.addEventListener('click', () => showFaq(i));
        faqDotsContainer.appendChild(dot);
        faqDots.push(dot);
    }

    
    function showFaq(index) {
        
        if (index >= totalFaqs) {
            index = 0;
        } else if (index < 0) {
            index = totalFaqs - 1;
        }

        currentFaqIndex = index;
        faqContainer.style.transform = `translateX(-${index * 100}%)`;

        faqDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    
    prevButton.addEventListener('click', () => {
        showFaq(currentFaqIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        showFaq(currentFaqIndex + 1);
    });

    
    showFaq(0);
}



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


window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;

    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);


document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});


document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

function updateScrollProgress() {
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    if (!scrollProgressBar) return;

    scrollProgressBar.style.width = `${Math.min(scrollProgress, 100)}%`;

    
    const progressContainer = document.querySelector('.scroll-progress');
    if (progressContainer) {
        if (scrollTop <= 50) {
            progressContainer.style.opacity = '0.5';
        } else {
            progressContainer.style.opacity = '1';
        }
    }
}


window.addEventListener('scroll', updateScrollProgress);


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
        const container = document.getElementById('canvas-container');
        if (!container) return;

        if (typeof THREE === 'undefined') {
            console.error('ERRORE: Three.js non è caricato!');
            return;
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        container.appendChild(this.renderer.domElement);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        const pointLight = new THREE.PointLight(0xff6b6b, 1, 100);
        pointLight.position.set(-5, 5, 0);
        this.scene.add(pointLight);

    
    }

    createParticles() {
        const particleCount = 300;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for(let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 30;
            positions[i + 1] = (Math.random() - 0.5) * 30;
            positions[i + 2] = (Math.random() - 0.5) * 30;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.08,
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
        
        if (this.particles) {
            this.particles.rotation.x += 0.0005;
            this.particles.rotation.y += 0.001;
            this.particles.rotation.x += this.mouse.y * 0.0001;
            this.particles.rotation.y += this.mouse.x * 0.0001;
        }
        
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }
}

const hamburger = document.getElementById('hamburger');
const offcanvas = document.getElementById('offcanvas');
const offcanvasOverlay = document.getElementById('offcanvasOverlay');
const offcanvasLinks = document.querySelectorAll('.offcanvas-nav a');

function openOffcanvas() {
    hamburger.classList.add('active');
    offcanvas.classList.add('active');
    offcanvasOverlay.classList.add('active');
    document.body.classList.add('offcanvas-open');
}

function closeOffcanvas() {
    hamburger.classList.remove('active');
    offcanvas.classList.remove('active');
    offcanvasOverlay.classList.remove('active');
    document.body.classList.remove('offcanvas-open');
}

if (hamburger && offcanvas && offcanvasOverlay) {
    hamburger.addEventListener('click', () => {
        if (offcanvas.classList.contains('active')) {
            closeOffcanvas();
        } else {
            openOffcanvas();
        }
    });

    offcanvasOverlay.addEventListener('click', closeOffcanvas);

    offcanvasLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeOffcanvas();
        
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && offcanvas.classList.contains('active')) {
            closeOffcanvas();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 800 && offcanvas.classList.contains('active')) {
            closeOffcanvas();
        }
    });
}

document.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('offcanvas-open') && 
        !offcanvas.contains(e.target)) {
        e.preventDefault();
    }
}, { passive: false });


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM caricato, inizializzo componenti...');
    initLoaderAndParticles();
    initThemeToggle();
    initFaqSlider();

    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer && typeof THREE !== 'undefined' && window.innerWidth > 800) {
        console.log('Inizializzo ParticleSystem (Desktop)...');
        new ParticleSystem();
    } else if (canvasContainer && window.innerWidth <= 800) {
        console.log('ParticleSystem non caricato (Mobile).');
    } else if (canvasContainer) {
        console.error('Three.js non è disponibile.');
    }
});