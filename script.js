// ===== PIXELSCRIPT WEBSITE INTERACTIVE FEATURES =====

// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let lastScrollTop = 0;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ===== MAIN INITIALIZATION =====
function initializeWebsite() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializePixelEffects();
    initializeMockupInteraction();
    initializeDownloadTracking();
    initializeSmoothScrolling();
    initializeParallax();
    initializeThemeToggle();
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Add loading animations
    addLoadingAnimations();
}

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    const navHamburger = document.getElementById('nav-hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navHamburger) {
        navHamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navHamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navHamburger.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target)) {
            navMenu.classList.remove('active');
            navHamburger.classList.remove('active');
        }
    });
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    window.addEventListener('scroll', throttle(handleScroll, 16)); // 60fps
}

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navbar = document.getElementById('navbar');
    
    // Add scrolled class to navbar
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active navigation link
    updateActiveNavLink();
    
    // Parallax effects
    handleParallax(scrollTop);
    
    lastScrollTop = scrollTop;
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== PARALLAX EFFECTS =====
function initializeParallax() {
    // Initialize parallax elements
    window.addEventListener('scroll', throttle(handleParallax, 16));
}

function handleParallax(scrollTop) {
    const heroBackground = document.querySelector('.hero-background');
    const floatingElements = document.querySelector('.floating-elements');
    
    if (heroBackground) {
        const speed = scrollTop * 0.5;
        heroBackground.style.transform = `translateY(${speed}px)`;
    }
    
    if (floatingElements) {
        const speed = scrollTop * 0.3;
        floatingElements.style.transform = `translateY(${speed}px)`;
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .gallery-item, .about-card');
    animateElements.forEach(el => observer.observe(el));
}

// ===== PIXEL EFFECTS =====
function initializePixelEffects() {
    createFloatingElements();
    animateTextEditor();
}

function createFloatingElements() {
    const heroBackground = document.querySelector('.floating-elements');
    if (!heroBackground) return;
    
    // Create floating text elements and cursor indicators
    const elements = ['A', 'B', 'C', '1', '2', '3', '|', '_'];
    for (let i = 0; i < 8; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = elements[i];
        element.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 10 + 15}px;
            font-family: 'JetBrains Mono', monospace;
            background: linear-gradient(135deg, #ec4899, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatRandom ${Math.random() * 10 + 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            opacity: ${Math.random() * 0.5 + 0.3};
            font-weight: 600;
        `;
        heroBackground.appendChild(element);
    }
    
    // Add floating animation keyframes
    if (!document.querySelector('#floating-animations')) {
        const style = document.createElement('style');
        style.id = 'floating-animations';
        style.textContent = `
            @keyframes floatRandom {
                0%, 100% {
                    transform: translateY(0px) translateX(0px) rotate(0deg);
                }
                25% {
                    transform: translateY(-30px) translateX(20px) rotate(90deg);
                }
                50% {
                    transform: translateY(-60px) translateX(-10px) rotate(180deg);
                }
                75% {
                    transform: translateY(-20px) translateX(-30px) rotate(270deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function animateTextEditor() {
    const textEditor = document.querySelector('.text-editor-mockup');
    if (!textEditor) return;
    
    // Create a realistic PixelScript+ interface mockup based on the actual app
    textEditor.innerHTML = `
        <div class="pixelscript-window">
            <div class="pixelscript-menubar">
                <span class="menu-item">File</span>
                <span class="menu-item">Edit</span>
                <span class="menu-item">Maths</span>
                <span class="menu-item">Utilities</span>
                <span class="menu-item">Settings</span>
            </div>
            <div class="pixelscript-editor">
                <div class="line-numbers">
                    <div class="line-number">1</div>
                    <div class="line-number">2</div>
                    <div class="line-number">3</div>
                    <div class="line-number">4</div>
                    <div class="line-number">5</div>
                    <div class="line-number">6</div>
                </div>
                <div class="text-content">
                    <div class="text-line">Welcome to PixelScript+</div>
                    <div class="text-line">A simple, extendable text editor.</div>
                    <div class="text-line"></div>
                    <div class="text-line">Start typing your thoughts here...</div>
                    <div class="text-line">Easy. Fast. Efficient.</div>
                    <div class="text-line current-line">Perfect for all your text editing needs<span class="cursor-blink">|</span></div>
                </div>
            </div>
        </div>
    `;
    
    // Add PixelScript+ specific styling
    if (!document.querySelector('#pixelscript-mockup-styles')) {
        const style = document.createElement('style');
        style.id = 'pixelscript-mockup-styles';
        style.textContent = `
            .pixelscript-window {
                width: 100%;
                height: 100%;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                font-family: Arial, sans-serif;
                font-size: 12px;
            }
            .pixelscript-menubar {
                background: #f0f0f0;
                padding: 6px 12px;
                border-bottom: 1px solid #d0d0d0;
                display: flex;
                gap: 20px;
                font-size: 11px;
            }
            .menu-item {
                color: #333;
                cursor: pointer;
                padding: 2px 4px;
            }
            .menu-item:hover {
                background: #e0e0e0;
            }
            .pixelscript-editor {
                display: flex;
                height: calc(100% - 30px);
            }
            .line-numbers {
                background: #f0f0f0;
                color: gray;
                padding: 8px 4px;
                text-align: right;
                min-width: 35px;
                border-right: 1px solid #e0e0e0;
                font-family: Arial, sans-serif;
            }
            .line-number {
                line-height: 1.4;
                font-size: 11px;
            }
            .text-content {
                padding: 8px 12px;
                flex: 1;
                color: #333;
            }
            .text-line {
                line-height: 1.4;
                min-height: 1.4em;
            }
            .current-line {
                background: rgba(236, 72, 153, 0.1);
            }
            .cursor-blink {
                animation: blink 1s infinite;
                color: #333;
                font-weight: bold;
            }
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== MOCKUP INTERACTION =====
function initializeMockupInteraction() {
    const appMockup = document.querySelector('.app-mockup');
    if (!appMockup) return;
    
    // Add mouse move effect
    appMockup.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    appMockup.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateY(-15deg) rotateX(10deg) scale(1)';
    });
}

// ===== THEME TOGGLE =====
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Load saved theme preference or default to light
    const savedTheme = localStorage.getItem('pixelscript-theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        updateThemeIcon(true);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = body.classList.contains('dark-theme');
            
            if (isDark) {
                body.classList.remove('dark-theme');
                localStorage.setItem('pixelscript-theme', 'light');
                updateThemeIcon(false);
            } else {
                body.classList.add('dark-theme');
                localStorage.setItem('pixelscript-theme', 'dark');
                updateThemeIcon(true);
            }
            
            // Re-render the text editor mockup to apply new theme
            setTimeout(() => {
                animateTextEditor();
            }, 100);
        });
    }
}

function updateThemeIcon(isDark) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if (isDark) {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }
}

// ===== DOWNLOAD TRACKING =====
function initializeDownloadTracking() {
    const downloadButtons = document.querySelectorAll('.download-btn, .btn-primary');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track download (you can replace this with actual analytics)
            const platform = this.dataset.platform || 'unknown';
            console.log(`Download initiated for platform: ${platform}`);
            
            // Show download feedback
            showDownloadFeedback();
        });
    });
}

function showDownloadFeedback() {
    // Create temporary feedback message
    const feedback = document.createElement('div');
    feedback.textContent = 'Download starting...';
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ec4899, #db2777);
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(feedback);
    
    // Remove feedback after 3 seconds
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 3000);
    
    // Add slide animations if not exist
    if (!document.querySelector('#feedback-animations')) {
        const style = document.createElement('style');
        style.id = 'feedback-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== LOADING ANIMATIONS =====
function addLoadingAnimations() {
    const elements = document.querySelectorAll('.hero-content > *, .feature-card, .gallery-item');
    
    elements.forEach((element, index) => {
        element.classList.add('loading');
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== GALLERY INTERACTION =====
function initializeGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.dataset.image;
            const imageAlt = this.querySelector('.gallery-title')?.textContent || 'Interface Preview';
            
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            
            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            modalContent.innerHTML = `
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <img src="${imageSrc}" alt="${imageAlt}" class="modal-image" onerror="this.parentElement.innerHTML='<div class=\\'gallery-placeholder\\'><i class=\\'fas fa-image\\'></i><p>Image not found: ${imageAlt}</p></div>'">
                <div class="modal-caption">${imageAlt}</div>
            `;
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Close modal functionality
            function closeModal() {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                        document.body.style.overflow = '';
                    }
                }, 300);
            }
            
            // Close on click outside image or close button
            modal.addEventListener('click', function(e) {
                if (e.target === modal || e.target.classList.contains('modal-close')) {
                    closeModal();
                }
            });
            
            // Close on escape key
            function handleEscape(e) {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', handleEscape);
                }
            }
            document.addEventListener('keydown', handleEscape);
            
            // Close button
            const closeBtn = modalContent.querySelector('.modal-close');
            closeBtn.addEventListener('click', closeModal);
        });
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function enhanceAccessibility() {
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close modals and menus
            const modal = document.querySelector('.gallery-modal');
            const navMenu = document.getElementById('nav-menu');
            const navHamburger = document.getElementById('nav-hamburger');
            
            if (modal) {
                modal.click();
            }
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navHamburger.classList.remove('active');
            }
        }
    });
    
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, [tabindex]');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #ec4899';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// ===== FINAL INITIALIZATION =====
window.addEventListener('load', function() {
    initializeGalleryModal();
    optimizePerformance();
    enhanceAccessibility();
    
    // Continue text editor animation
    setInterval(() => {
        animateTextEditor();
    }, 5000);
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', debounce(function() {
    // Recalculate positions and animations on resize
    updateActiveNavLink();
}, 250));