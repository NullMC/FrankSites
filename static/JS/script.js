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
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
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