/**
 * MOMO Technology - Interactive JavaScript
 * Modern interactions, animations, and functionality
 */

// ===================================
// DOM Elements
// ===================================
const nav = document.getElementById('nav');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('[data-mobile-link]');
const cursorFollower = document.querySelector('.cursor-follower');
const cursorDot = document.querySelector('.cursor-dot');
const particlesContainer = document.getElementById('particles');

// ===================================
// Custom Cursor
// ===================================
class CustomCursor {
    constructor() {
        this.cursor = cursorFollower;
        this.dot = cursorDot;
        this.cursorX = 0;
        this.cursorY = 0;
        this.dotX = 0;
        this.dotY = 0;
        
        if (!this.cursor || !this.dot) return;
        
        this.init();
    }
    
    init() {
        // Check if device supports hover
        if (window.matchMedia('(hover: none)').matches) return;
        
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseenter', () => this.show());
        document.addEventListener('mouseleave', () => this.hide());
        
        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [data-cursor-hover]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
        
        this.animate();
    }
    
    onMouseMove(e) {
        this.cursorX = e.clientX;
        this.cursorY = e.clientY;
    }
    
    animate() {
        // Smooth follow for cursor follower
        this.dotX += (this.cursorX - this.dotX) * 0.15;
        this.dotY += (this.cursorY - this.dotY) * 0.15;
        
        const followerX = this.dotX + (this.cursorX - this.dotX) * 0.1;
        const followerY = this.dotY + (this.cursorY - this.dotY) * 0.1;
        
        this.cursor.style.left = `${followerX}px`;
        this.cursor.style.top = `${followerY}px`;
        this.dot.style.left = `${this.dotX}px`;
        this.dot.style.top = `${this.dotY}px`;
        
        requestAnimationFrame(() => this.animate());
    }
    
    show() {
        this.cursor.style.opacity = '1';
        this.dot.style.opacity = '1';
    }
    
    hide() {
        this.cursor.style.opacity = '0';
        this.dot.style.opacity = '0';
    }
}

// ===================================
// Navigation
// ===================================
class Navigation {
    constructor() {
        this.nav = nav;
        this.toggle = navToggle;
        this.menu = mobileMenu;
        this.links = mobileLinks;
        this.isOpen = false;
        this.lastScrollY = 0;
        
        if (!this.nav) return;
        
        this.init();
    }
    
    init() {
        // Scroll handler
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        
        // Mobile menu toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu on link click
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Initial check
        this.onScroll();
    }
    
    onScroll() {
        const scrollY = window.scrollY;
        
        // Add scrolled class
        if (scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
        
        this.lastScrollY = scrollY;
    }
    
    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.toggle.classList.add('active');
        this.menu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.isOpen = false;
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===================================
// Particles Background
// ===================================
class Particles {
    constructor() {
        this.container = particlesContainer;
        this.particleCount = 30;
        
        if (!this.container) return;
        
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay and duration
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${6 + Math.random() * 4}s`;
        
        // Random size
        const size = 2 + Math.random() * 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random color
        const colors = ['#8b5cf6', '#06b6d4', '#f472b6', '#f59e0b'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        this.container.appendChild(particle);
    }
}

// ===================================
// Scroll Animations
// ===================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        
        if (this.elements.length === 0) return;
        
        this.init();
    }
    
    init() {
        // Create intersection observer
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all elements
        this.elements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// ===================================
// Counter Animation
// ===================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        
        if (this.counters.length === 0) return;
        
        this.init();
    }
    
    init() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-expo)
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.round(target * easeOutExpo);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
}

// ===================================
// Smooth Scroll
// ===================================
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        
        if (this.links.length === 0) return;
        
        this.init();
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===================================
// Form Handling
// ===================================
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add floating label effect
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate
        if (!this.validate(data)) return;
        
        // Show success message (in a real app, you'd send to server)
        this.showSuccess();
        
        // Reset form
        this.form.reset();
    }
    
    validate(data) {
        let isValid = true;
        
        // Simple validation
        if (!data.name || data.name.trim().length < 2) {
            this.showError('name', 'お名前を入力してください');
            isValid = false;
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            this.showError('email', '有効なメールアドレスを入力してください');
            isValid = false;
        }
        
        if (!data.message || data.message.trim().length < 10) {
            this.showError('message', 'メッセージを入力してください（10文字以上）');
            isValid = false;
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    showError(field, message) {
        const input = this.form.querySelector(`#${field}`);
        if (input) {
            input.style.borderColor = '#ef4444';
            
            // Remove existing error
            const existingError = input.parentElement.querySelector('.error-message');
            if (existingError) existingError.remove();
            
            // Add error message
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.5rem; display: block;';
            errorEl.textContent = message;
            input.parentElement.appendChild(errorEl);
            
            // Clear on input
            input.addEventListener('input', () => {
                input.style.borderColor = '';
                const error = input.parentElement.querySelector('.error-message');
                if (error) error.remove();
            }, { once: true });
        }
    }
    
    showSuccess() {
        // Create success message
        const successEl = document.createElement('div');
        successEl.className = 'success-message';
        successEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
            color: white;
            padding: 2rem 3rem;
            border-radius: 1rem;
            font-weight: 600;
            font-size: 1.125rem;
            z-index: 10000;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: fadeInScale 0.3s ease;
        `;
        successEl.innerHTML = `
            <div style="text-align: center;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 1rem;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>お問い合わせありがとうございます！</p>
                <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 0.5rem;">48時間以内にご連絡いたします。</p>
            </div>
        `;
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInScale {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(successEl);
        
        // Remove after delay
        setTimeout(() => {
            overlay.remove();
            successEl.remove();
            style.remove();
        }, 3000);
    }
}

// ===================================
// Parallax Effect
// ===================================
class Parallax {
    constructor() {
        this.hero = document.querySelector('.hero');
        
        if (!this.hero) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }
    
    onScroll() {
        const scrollY = window.scrollY;
        const heroHeight = this.hero.offsetHeight;
        
        if (scrollY > heroHeight) return;
        
        const gradient = this.hero.querySelector('.hero-gradient');
        const grid = this.hero.querySelector('.hero-grid');
        const content = this.hero.querySelector('.hero-content');
        
        if (gradient) {
            gradient.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        
        if (grid) {
            grid.style.transform = `translateY(${scrollY * 0.2}px)`;
        }
        
        if (content) {
            content.style.transform = `translateY(${scrollY * 0.1}px)`;
            content.style.opacity = 1 - (scrollY / heroHeight) * 0.5;
        }
    }
}

// ===================================
// Magnetic Buttons Effect
// ===================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary, .nav-cta');
        
        if (this.buttons.length === 0) return;
        if (window.matchMedia('(hover: none)').matches) return;
        
        this.init();
    }
    
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => this.onMouseMove(e, button));
            button.addEventListener('mouseleave', (e) => this.onMouseLeave(e, button));
        });
    }
    
    onMouseMove(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }
    
    onMouseLeave(e, button) {
        button.style.transform = 'translate(0, 0)';
    }
}

// ===================================
// Tilt Effect for Cards
// ===================================
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.service-card, .project-card, .team-card');
        
        if (this.cards.length === 0) return;
        if (window.matchMedia('(hover: none)').matches) return;
        
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.onMouseLeave(card));
        });
    }
    
    onMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }
    
    onMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ===================================
// Text Reveal Animation
// ===================================
class TextReveal {
    constructor() {
        this.titles = document.querySelectorAll('.hero-title .title-line');
        
        if (this.titles.length === 0) return;
        
        this.init();
    }
    
    init() {
        // Wrap each character in a span
        this.titles.forEach((title, index) => {
            const text = title.textContent;
            title.innerHTML = '';
            
            text.split('').forEach((char, charIndex) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(50px);
                    animation: revealChar 0.6s ease forwards;
                    animation-delay: ${0.3 + (index * 0.2) + (charIndex * 0.03)}s;
                `;
                title.appendChild(span);
            });
        });
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes revealChar {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===================================
// Typing Effect
// ===================================
class TypingEffect {
    constructor() {
        this.element = document.querySelector('.hero-description');
        
        if (!this.element) return;
        
        // Only run on larger screens
        if (window.innerWidth < 768) return;
        
        this.text = this.element.textContent;
        this.init();
    }
    
    init() {
        this.element.textContent = '';
        this.element.style.opacity = '1';
        
        let charIndex = 0;
        
        const type = () => {
            if (charIndex < this.text.length) {
                this.element.textContent += this.text.charAt(charIndex);
                charIndex++;
                setTimeout(type, 30);
            }
        };
        
        // Start after hero title animation
        setTimeout(type, 1500);
    }
}

// ===================================
// Active Section Highlighting
// ===================================
class ActiveSection {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-links a[data-nav-link]');
        
        if (this.sections.length === 0) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }
    
    onScroll() {
        const scrollY = window.scrollY;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ===================================
// Initialize Everything
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new Navigation();
    new SmoothScroll();
    new ScrollAnimations();
    new CounterAnimation();
    new ContactForm();
    
    // Visual effects
    new CustomCursor();
    new Particles();
    new Parallax();
    new MagneticButtons();
    new TiltEffect();
    new TextReveal();
    new ActiveSection();
    
    // Log for debugging
    console.log('🚀 MOMO Technology - All systems initialized');
});

// ===================================
// Performance Optimization
// ===================================
// Preload critical resources
const preloadLinks = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
];

preloadLinks.forEach(({ rel, href, crossorigin }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
});

// Add active style for nav links
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-links a.active {
        color: var(--color-text-primary);
    }
    .nav-links a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeStyle);

