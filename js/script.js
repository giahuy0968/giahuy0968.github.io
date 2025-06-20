/*
    Interactive JavaScript for CV Website
    Author: Nguyễn Gia Huy
    Description: Handles animations, interactivity, and user experience enhancements
    
    Key Features:
    - Typing animation for hero section
    - Scroll-triggered animations
    - Navigation interactions
    - Skill bar animations
    - Smooth scrolling
    - Mobile menu functionality
*/

// Modern CV Website JavaScript

// Typing Animation
class TypingAnimation {
    constructor(element, texts, typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const fullText = this.texts[this.currentIndex];
        
        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = fullText.substring(0, this.currentText.length + 1);
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentText === fullText) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Intersection Observer for animations
class ScrollAnimations {
    constructor() {
        this.initObserver();
        this.animateOnScroll();
    }

    initObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animate skill bars
                    if (entry.target.classList.contains('skill-progress')) {
                        const progress = entry.target.getAttribute('data-progress');
                        setTimeout(() => {
                            entry.target.style.width = progress + '%';
                        }, 200);
                    }

                    // Animate counters
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }                    // Animate circular progress bars
                    if (entry.target.classList.contains('circle-progress')) {
                        this.animateCircleProgress(entry.target);
                    }
                }
            });
        }, options);
    }    animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll, .skill-progress, .stat-number, .circle-progress');
        elements.forEach(el => this.observer.observe(el));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }    // Animate circular progress bars
    animateCircleProgress(element) {
        const percent = parseInt(element.getAttribute('data-percent'));
        if (isNaN(percent) || percent < 0 || percent > 100) return; // Prevent NaN errors and validate range
        
        let currentPercent = 0;
        const duration = 2000;
        const increment = percent / (duration / 16);

        const updateProgress = () => {
            currentPercent += increment;
            if (currentPercent < percent) {
                element.style.setProperty('--progress', currentPercent);
                requestAnimationFrame(updateProgress);
            } else {
                element.style.setProperty('--progress', percent);
            }
        };

        // Start animation after a small delay
        setTimeout(() => {
            updateProgress();
        }, 300);
    }
}

// Smooth scrolling navigation
class SmoothNavigation {
    constructor() {
        this.initSmoothScroll();
        this.initNavToggle();
        this.initScrollSpy();
        this.initBackToTop();
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.main-nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initNavToggle() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

// Navbar scroll effect
class NavbarEffects {
    constructor() {
        this.initScrollEffect();
    }

    initScrollEffect() {
        const navbar = document.querySelector('.main-nav');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (currentScroll > lastScroll && currentScroll > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }
}

// Tilt effect for project cards
class TiltEffect {
    constructor() {
        this.initTilt();
    }

    initTilt() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }
}

// Form handling
class ContactForm {
    constructor() {
        this.initForm();
    }

    initForm() {
        const form = document.querySelector('.form-container');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form);
            });
        }
    }

    handleSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span><ion-icon name="hourglass-outline"></ion-icon>';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span><ion-icon name="checkmark-outline"></ion-icon>';
            submitBtn.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
        }, 2000);
    }
}

// Particle animation
class ParticleSystem {
    constructor() {
        this.initParticles();
    }

    initParticles() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            this.animateParticle(particle, index);
        });
    }

    animateParticle(particle, index) {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDelay = Math.random() * 5;
        const randomDuration = 6 + Math.random() * 4;
        
        particle.style.left = randomX + '%';
        particle.style.top = randomY + '%';
        particle.style.animationDelay = randomDelay + 's';
        particle.style.animationDuration = randomDuration + 's';
    }
}

// Language Switcher
function setLanguage(lang) {
    document.querySelectorAll('[data-vi], [data-en]').forEach(el => {
        if (lang === 'vi' && el.dataset.vi) {
            el.textContent = el.dataset.vi;
        } else if (lang === 'en' && el.dataset.en) {
            el.textContent = el.dataset.en;
        }
    });
    document.getElementById('lang-vi').classList.toggle('active', lang === 'vi');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}
document.getElementById('lang-vi').onclick = () => setLanguage('vi');
document.getElementById('lang-en').onclick = () => setLanguage('en');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typing animation
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new TypingAnimation(typingElement, [
            'AI Developer',
            'Machine Learning Engineer',
            'Computer Vision Specialist',
            'Yoga Instructor',
            'Content Creator',
            'Research Enthusiast'
        ]);
    }

    // Initialize all modules
    new ScrollAnimations();
    new SmoothNavigation();
    new NavbarEffects();
    new TiltEffect();
    new ContactForm();
    new ParticleSystem();

    // Add staggered animations for cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Add hover effects for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });

    // Preloader animation
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(preloader);
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 1000);
});

// Performance optimization
window.addEventListener('load', () => {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Theme toggle (optional feature)
class ThemeToggle {
    constructor() {
        this.initTheme();
    }

    initTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            });
        }

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}
