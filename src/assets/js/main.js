// digitaldias Website JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    startSubtleAnimations();
});

function initializePage() {
    console.log('digitaldias website loaded successfully!');
    
    // Add click tracking for analytics (placeholder)
    trackPageLoad();
}

const motionPreferenceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function userPrefersReducedMotion() {
    return motionPreferenceQuery.matches;
}

motionPreferenceQuery.addEventListener('change', (event) => {
    if (!event.matches) {
        startSubtleAnimations();
    }
});

function startSubtleAnimations() {
    if (userPrefersReducedMotion()) {
        return;
    }

    createMinimalParticles();
}

function createMinimalParticles() {
    const particleCount = 4;

    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(255, 215, 0, 0.18);
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
                animation: subtleFloat ${18 + Math.random() * 12}s linear infinite;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
            `;

            document.body.appendChild(particle);

            const removeParticle = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };

            setTimeout(removeParticle, 30000);
            window.addEventListener('pagehide', removeParticle, { once: true });
        }, i * 2000);
    }
}

function trackPageLoad() {
    // Placeholder for analytics tracking
    console.log('digitaldias page loaded at:', new Date().toISOString());
    console.log('User agent:', navigator.userAgent);
    console.log('Screen resolution:', screen.width + 'x' + screen.height);
}

// Add modern CSS animations
function addModernStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes subtleFloat {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg); 
                opacity: 0.1; 
            }
            25% { 
                opacity: 0.3; 
            }
            50% { 
                transform: translateY(-20px) rotate(180deg); 
                opacity: 0.4; 
            }
            75% { 
                opacity: 0.3; 
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideInFromRight {
            from { 
                transform: translateX(100px); 
                opacity: 0; 
            }
            to { 
                transform: translateX(0); 
                opacity: 1; 
            }
        }
        
        @keyframes slideOutToRight {
            from { 
                transform: translateX(0); 
                opacity: 1; 
            }
            to { 
                transform: translateX(100px); 
                opacity: 0; 
            }
        }
        
        @keyframes slideInFromBottom {
            from { 
                transform: translateY(30px); 
                opacity: 0; 
            }
            to { 
                transform: translateY(0); 
                opacity: 1; 
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize modern styles
addModernStyles();

// Modern JavaScript for digitaldias portfolio
class DigitalDiasPortfolio {
    constructor() {
        this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.prefersReducedMotion = this.motionQuery.matches;

        this.motionQuery.addEventListener('change', (event) => {
            this.prefersReducedMotion = event.matches;
            if (event.matches) {
                this.showElementsWithoutAnimation();
                this.setCountersImmediately();
            }
        });

        this.init();
    }

    init() {
        this.initLoading();
        this.initNavigation();

        if (this.prefersReducedMotion) {
            this.showElementsWithoutAnimation();
            this.setCountersImmediately();
        } else {
            this.initScrollAnimations();
        }

        this.initCounters();

        if (!this.prefersReducedMotion) {
            this.initMagneticButtons();
            this.initTiltCards();
            this.initParallax();
        }

        this.initPhotoGallery();
        this.initThemeDetection();
    }

    // Loading screen
    initLoading() {
        const loadingScreen = document.querySelector('.loading-screen');
        
        // Simulate loading time
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }
        }, 1500);
    }

    // Navigation - Always visible
    initNavigation() {
        const nav = document.querySelector('[data-nav]');
        const navLinks = document.querySelectorAll('[data-nav-link]');
        const navToggle = document.querySelector('[data-nav-toggle]');
        const navMenu = document.querySelector('[data-nav-menu]');

        if (!nav) {
            return;
        }

        // Enhanced scroll behavior - only change background opacity
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                nav.style.background = 'rgba(10, 10, 10, 0.98)';
                nav.style.backdropFilter = 'blur(20px)';
            } else {
                nav.style.background = 'rgba(10, 10, 10, 0.95)';
                nav.style.backdropFilter = 'blur(16px)';
            }
        });

        // Active section detection
        const sections = document.querySelectorAll('section[id]');
        
        const updateActiveNav = () => {
            const scrollY = window.scrollY + 200;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };
        
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav();

        // Smooth scroll for same-page anchors only; allow default navigation otherwise
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href) {
                    const linkUrl = new URL(href, window.location.href);
                    const targetId = linkUrl.hash ? linkUrl.hash.substring(1) : null;
                    const isSameDocument = href.startsWith('#') || linkUrl.pathname === window.location.pathname;
                    const targetSection = targetId ? document.getElementById(targetId) : null;

                    if (targetSection && isSameDocument) {
                        e.preventDefault();
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }

                if (navToggle && navMenu) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', (!isExpanded).toString());
                navToggle.classList.toggle('active', !isExpanded);
                navMenu.classList.toggle('active', !isExpanded);
            });
        }
    }

    // Scroll animations
    initScrollAnimations() {
        if (this.prefersReducedMotion) {
            this.showElementsWithoutAnimation();
            this.setCountersImmediately();
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Trigger counter animations
                    if (entry.target.hasAttribute('data-animate')) {
                        this.animateCounter(entry.target);
                    }
                    
                    // Stagger animations for grid items
                    if (entry.target.classList.contains('expertise-grid') || 
                        entry.target.classList.contains('photo-masonry')) {
                        const items = entry.target.children;
                        Array.from(items).forEach((item, index) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll(this.getAnimatedSelector());

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }

    getAnimatedSelector() {
        return `
            .section-header,
            .expertise-card,
            .photo-item,
            .timeline-item,
            .contact-card,
            [data-animate]
        `;
    }

    showElementsWithoutAnimation() {
        const animatedElements = document.querySelectorAll(this.getAnimatedSelector());
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
    }

    setCountersImmediately() {
        const counterElements = document.querySelectorAll('[data-animate] .stat-number');
        counterElements.forEach(numberElement => {
            const parent = numberElement.closest('[data-animate]');
            const target = parent ? parent.getAttribute('data-target') : null;

            if (parent && target) {
                numberElement.textContent = target;
            }
        });
    }

    // Counter animations
    initCounters() {
        // Will be triggered by scroll animations
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const numberElement = element.querySelector('.stat-number');
        const duration = 2000;
        const startTime = performance.now();
        
        if (element.classList.contains('infinity-stat')) return;

        if (this.prefersReducedMotion) {
            if (numberElement) {
                numberElement.textContent = target;
            }
            return;
        }

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeOutExpo * target);
            
            if (numberElement) {
                numberElement.textContent = current;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                if (numberElement) {
                    numberElement.textContent = target;
                }
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    // Magnetic buttons - simplified without cursor dependency
    initMagneticButtons() {
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        
        if (!magneticElements.length) {
            return;
        }

        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.prefersReducedMotion) {
                    element.style.transform = 'translate(0, 0)';
                    return;
                }
                element.style.transition = 'transform 0.3s ease';
            });
            
            element.addEventListener('mousemove', (e) => {
                if (this.prefersReducedMotion) {
                    element.style.transform = 'translate(0, 0)';
                    return;
                }
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.15;
                const moveY = y * 0.15;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
                element.style.transition = 'transform 0.5s ease';
            });
        });
    }

    // Tilt cards
    initTiltCards() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                if (this.prefersReducedMotion) {
                    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                    return;
                }
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    // Photo gallery
    initPhotoGallery() {
        const photoItems = document.querySelectorAll('.photo-item');
        
        photoItems.forEach(item => {
            const img = item.querySelector('img');

            if (!img) {
                return;
            }
            
            // Lazy loading
            if (img && img.hasAttribute('loading')) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                imageObserver.observe(img);
            }
            
            // Photo interactions
            const photoButtons = item.querySelectorAll('[data-action]');
            photoButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const action = button.getAttribute('data-action');
                    const imgSrc = img.src;
                    
                    if (action === 'view') {
                        this.openLightbox(imgSrc);
                    } else if (action === 'external') {
                        const externalWindow = window.open(imgSrc, '_blank', 'noopener');
                        if (externalWindow) {
                            externalWindow.opener = null;
                        }
                    }
                });
            });
        });
    }

    openLightbox(imageSrc) {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-content">
                <img src="${imageSrc}" alt="Gallery image">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        
        // Add styles
        lightbox.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        backdrop.style.cssText = `
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
        `;
        
        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        content.setAttribute('role', 'document');
        
        const img = lightbox.querySelector('img');
        img.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        `;
        
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -15px;
            right: -15px;
            width: 40px;
            height: 40px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        closeBtn.setAttribute('aria-label', 'Close image preview');
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Animate in
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
            content.style.transform = 'scale(1)';
        });

        closeBtn.focus();
        
        // Close handlers
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            content.style.transform = 'scale(0.8)';
            document.body.style.overflow = '';
            
            setTimeout(() => {
                lightbox.remove();
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // Theme detection
    initThemeDetection() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        prefersDark.addEventListener('change', (e) => {
            // Theme already handled by CSS
            console.log('Theme changed to:', e.matches ? 'dark' : 'light');
        });
    }

    // Parallax effects
    initParallax() {
        const parallaxElements = document.querySelectorAll('.photo-tile');
        
        window.addEventListener('scroll', () => {
            if (this.prefersReducedMotion) {
                parallaxElements.forEach(element => {
                    element.style.transform = 'none';
                });
                return;
            }

            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.3;
            
            parallaxElements.forEach((element, index) => {
                const rate = (index % 3) * 0.1 + 0.1;
                element.style.transform = `translateY(${parallax * rate}px)`;
            });
        });
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
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
}

// Enhanced scroll reveal with intersection observer
class ScrollReveal {
    constructor() {
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.init();
    }
    
    init() {
        const elements = document.querySelectorAll(`
            .hero-badge,
            .hero-title,
            .hero-description,
            .hero-actions,
            .stat-card,
            .section-badge,
            .section-title,
            .section-description,
            .expertise-card,
            .photo-item,
            .timeline-item,
            .contact-card
        `);
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Reading Progress Indicator
function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress-bar');
    const progressContainer = document.getElementById('reading-progress');
    const article = document.querySelector('.article-container');
    
    if (!progressBar || !article || !progressContainer) {
        // Hide progress bar if not on blog post
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        return; // Not on a blog post page
    }
    
    // Ensure progress bar is visible on blog posts
    progressContainer.style.display = 'block';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function updateProgress() {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const articleBottom = articleTop + articleHeight;
        const viewportTop = scrollTop;
        const viewportBottom = scrollTop + windowHeight;
        
        // Calculate how much of the article has been scrolled past
        let scrolled = 0;
        if (viewportTop < articleTop) {
            scrolled = 0;
        } else if (viewportBottom > articleBottom) {
            scrolled = 100;
        } else {
            scrolled = ((viewportTop - articleTop) / articleHeight) * 100;
        }
        
        const progress = Math.min(100, Math.max(0, scrolled));
        progressBar.style.width = progress + '%';
        progressContainer.setAttribute('aria-valuenow', Math.round(progress));
    }
    
    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Initial calculation
    updateProgress();
    
    // Update on resize
    window.addEventListener('resize', updateProgress, { passive: true });
}

// Track Ko-fi support link clicks
function initKofiTracking() {
    const kofiLinks = document.querySelectorAll('a[data-cta="kofi"]');
    
    kofiLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only track if gtag is available (Google Analytics)
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'support_click', {
                    'event_category': 'Support',
                    'event_label': 'kofi',
                    'value': 1
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalDiasPortfolio();
    new ScrollReveal();
    initReadingProgress();
    initKofiTracking();
    
    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    // Performance monitoring
    if ('performance' in window && 'measure' in performance) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                console.log(`Page load time: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
            }, 0);
        });
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DigitalDiasPortfolio, ScrollReveal };
}