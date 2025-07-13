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
