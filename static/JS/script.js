document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.getElementById('themeToggle');
  const body=document.body;
  // initial state
  if(localStorage.getItem('theme')==='dark'){
    body.classList.add('dark-mode');
    toggle.innerHTML='<i class="fas fa-sun"></i>';
  }
  toggle.addEventListener('click',()=>{
    body.classList.toggle('dark-mode');
    const isDark=body.classList.contains('dark-mode');
    toggle.innerHTML=isDark?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>';
    localStorage.setItem('theme',isDark?'dark':'light');
  });
});

// FAQ Slider functionality
let currentFaqIndex = 0;
const faqContainer = document.getElementById('faqContainer');
const faqDots = document.querySelectorAll('.faq-dot');
const totalFaqs = 4;

function showFaq(index) {
    currentFaqIndex = index;
    faqContainer.style.transform = `translateX(-${index * 100}%)`;
    
    faqDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextFaq() {
    const nextIndex = (currentFaqIndex + 1) % totalFaqs;
    showFaq(nextIndex);
}

function previousFaq() {
    const prevIndex = (currentFaqIndex - 1 + totalFaqs) % totalFaqs;
    showFaq(prevIndex);
}

function currentFaq(index) {
    showFaq(index);
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
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');

    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.classList.remove("scrolled");
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
    
    scrollProgressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
    
    // Nascondi la barra quando si è in cima
    const progressContainer = document.querySelector('.scroll-progress');
    if (scrollTop <= 50) {
        progressContainer.style.opacity = '0.5';
    } else {
        progressContainer.style.opacity = '1';
    }
}

// Event listener per lo scroll
window.addEventListener('scroll', updateScrollProgress);

// Inizializza la barra al caricamento
document.addEventListener('DOMContentLoaded', updateScrollProgress);

class Logo3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.logo = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 }; // Rotazione target per hover
        this.currentRotation = { x: 0, y: 0 }; // Rotazione corrente
        this.baseRotation = { x: 0, y: 0, z: 0 }; // Rotazione base statica
        
        this.init();
        this.createLogo();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Verifica se il container esiste
        const container = document.getElementById('canvas-container');
        if (!container) {
            console.error('ERRORE: Aggiungi <div id="canvas-container"></div> al tuo HTML!');
            return;
        }

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

    createLogo() {
        // Prova prima a caricare il GLB, se fallisce usa il fallback
        if (typeof THREE.GLTFLoader !== 'undefined') {
            this.loadGLBLogo();
        }
    }

    loadGLBLogo() {
        const loader = new THREE.GLTFLoader();
        
        // Percorso corretto basato sulla tua struttura
        const logoPath = 'static/JS/logo.glb';
        
        console.log('🔍 Caricamento GLB da:', logoPath);
        
        loader.load(
            logoPath,
            (gltf) => {
                console.log('✅ GLB caricato con successo!');
                console.log('Contenuto GLB:', gltf);
                
                this.logo = gltf.scene;
                
                // Posizionamento e rotazione base
                this.logo.position.set(0, 0, -1);

                // 🔧 Scala adeguata per oggetti piccoli
                this.logo.scale.setScalar(50); // prova con 50, se troppo grande usa 20 o 10
                
                // Imposta rotazione base statica (puoi personalizzare questi valori)
                this.baseRotation.x = 0;      
                this.baseRotation.y = 0;      
                this.baseRotation.z = 0;      
                
                this.logo.rotation.x = this.baseRotation.x;
                this.logo.rotation.y = this.baseRotation.y;
                this.logo.rotation.z = this.baseRotation.z;
                
                this.scene.add(this.logo);
                console.log('🎉 Logo GLB aggiunto alla scena!');
            },
            (progress) => {
                const percentage = Math.round(progress.loaded / progress.total * 100);
                console.log(`📥 Caricamento: ${percentage}% (${progress.loaded}/${progress.total} bytes)`);
            },
        );
    }

    createParticles() {
        const particleCount = 150;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for(let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 25;     // x
            positions[i + 1] = (Math.random() - 0.5) * 25; // y
            positions[i + 2] = (Math.random() - 0.5) * 25; // z
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05,
            transparent: true,
            opacity: 0.8
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        this.particles = particles;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Eventi per hover del logo
        this.renderer.domElement.addEventListener('mouseenter', () => this.onLogoHover(true));
        this.renderer.domElement.addEventListener('mouseleave', () => this.onLogoHover(false));
    }
    
    onLogoHover(isHovering) {
        // Reset rotazione quando il mouse esce dall'area
        if (!isHovering) {
            this.targetRotation.x = 0;
            this.targetRotation.y = 0;
        }
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.logo) {
            if (window.innerWidth < 768) {
                this.logo.position.x = 0;
                this.logo.position.y = -0.5;
                this.logo.scale.set(0.6, 0.6, 0.6);
            } else {
                this.logo.position.x = 0;
                this.logo.position.y = 0;
                this.logo.scale.set(0.8, 0.8, 0.8);
            }
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Calcola rotazione target solo se il mouse è sull'area del canvas
        const rect = this.renderer.domElement.getBoundingClientRect();
        const isOverCanvas = (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );
        
        if (isOverCanvas) {
            // Movimento limitato: massimo ±15 gradi (circa 0.26 radianti)
            const maxRotation = 0.26;
            this.targetRotation.x = this.mouse.y * maxRotation * 0.3; // Movimento verticale ridotto
            this.targetRotation.y = this.mouse.x * maxRotation * 0.5; // Movimento orizzontale
        }
    }

    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;
        
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        if (this.logo) {
            // Interpolazione fluida verso la rotazione target
            const lerpFactor = 0.05; // Velocità di interpolazione (più basso = più fluido)
            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * lerpFactor;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * lerpFactor;
            
            // Applica la rotazione: base + movimento del mouse
            this.logo.rotation.x = this.baseRotation.x + this.currentRotation.x;
            this.logo.rotation.y = this.baseRotation.y + this.currentRotation.y;
            this.logo.rotation.z = this.baseRotation.z;
            
            // RIMUOVO: tutte le animazioni automatiche
            // Mantieni solo animazione leggera per le sfere del fallback (se presenti)
            if (this.logo.children && this.logo.children.length > 1) {
                this.logo.children.forEach((child, index) => {
                    if (index > 0 && index <= 4) { // Le 4 sfere del fallback
                        // Animazione molto sottile per le sfere
                        child.position.z = 0.3 + Math.sin(time * 0.5 + index * 0.5) * 0.1;
                    }
                });
            }
        }
        
        // Animazione particelle più lenta
        if (this.particles) {
            this.particles.rotation.x += 0.0001;
            this.particles.rotation.y += 0.0002;
        }
        
        // RIMUOVO: movimento automatico della camera
        // La camera rimane fissa
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Inizializza quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM caricato, inizializzo Logo3D...');
    new Logo3D();
});