// digitaldias Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize the page
    initializePage();
    
    // Add event listeners
    addEventListeners();
    
    // Start subtle background animations
    startSubtleAnimations();
    
    // Initialize skill category interactions
    initializeSkillCategories();
    
    // Initialize progress animations
    initializeProgressAnimations();
});

function initializePage() {
    console.log('digitaldias website loaded successfully!');
    
    // Add click tracking for analytics (placeholder)
    trackPageLoad();
}

function addEventListeners() {
    const logo = document.querySelector('.logo');
    const contactLinks = document.querySelectorAll('.contact-link');
    
    // Logo click animation - simple and clean
    if (logo) {
        logo.addEventListener('click', function() {
            showPersonalMessage();
        });
    }
    
    // Contact link interactions
    contactLinks.forEach((contactLink) => {
        contactLink.addEventListener('click', function(e) {
            // Track contact click (placeholder for analytics)
            trackContactClick(this.className, this.href);
            
            // Show subtle feedback
            showContactFeedback(this);
        });
    });
}

function initializeSkillCategories() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach((category, index) => {
        category.addEventListener('click', function() {
            // Remove active class from all categories
            skillCategories.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            this.classList.add('active');
            
            // Show category details
            showSkillDetails(index);
        });
        
        category.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-4px) scale(1.01)';
            }
        });
        
        category.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

function initializeProgressAnimations() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = progressBar.style.width || '75%';
                }
            }
        });
    }, observerOptions);
    
    const focusItems = document.querySelectorAll('.focus-item.primary');
    focusItems.forEach(item => observer.observe(item));
}

function startSubtleAnimations() {
    // Create minimal floating particles effect - very subtle
    createMinimalParticles();
}

function createMinimalParticles() {
    const particleCount = 6; // Reduced for cleaner look
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(255, 215, 0, 0.2);
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
                animation: subtleFloat ${20 + Math.random() * 15}s linear infinite;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
            `;
            
            document.body.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 35000);
        }, i * 2000); // Slower, more spaced out
    }
}

function showPersonalMessage() {
    const messages = [
        "?? Welcome to my digital workspace!",
        "?? Currently building something amazing...",
        "?? Capturing code and life moments",
        "??????????? Family-driven developer",
        "?? .NET architect by passion",
        "?? Coding since 1985!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create clean message element
    const messageEl = document.createElement('div');
    messageEl.textContent = randomMessage;
    messageEl.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: rgba(0, 0, 0, 0.9);
        color: #FFD700;
        padding: 1rem 2rem;
        border-radius: 16px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1), slideOutToRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) 3.5s forwards;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(10px);
        max-width: 320px;
        font-size: 0.9rem;
        border: 1px solid rgba(255, 215, 0, 0.3);
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 3900);
}

function showSkillDetails(index) {
    const skills = [
        {
            title: "Software Architecture",
            description: "Designing and building enterprise-scale applications with modern .NET technologies. I focus on clean architecture patterns, microservices, and performance optimization to create maintainable solutions that scale.",
            highlights: ["Clean Architecture", "Microservices", "Performance Optimization", "Code Quality"]
        },
        {
            title: "Photography & Visual Arts", 
            description: "The art of capturing moments through the lens. 'Dias' connects to 'Diapositive', reflecting my passion for visual storytelling. I document both technical processes and family life through photography.",
            highlights: ["Visual Storytelling", "Technical Documentation", "Family Moments", "Artistic Expression"]
        },
        {
            title: "Content Creation",
            description: "Sharing knowledge through video content on multiple platforms. Technical tutorials on development discoveries, and family moments preserved for our extended family to enjoy and connect with.",
            highlights: ["Technical Tutorials", "Knowledge Sharing", "Family Documentation", "Community Building"]
        }
    ];
    
    const skill = skills[index];
    if (!skill) return;
    
    // Create enhanced modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(12px);
        padding: 2rem;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: #0A0A0A;
        color: #FFFFFF;
        padding: 3rem;
        border-radius: 24px;
        text-align: left;
        max-width: 600px;
        width: 100%;
        animation: slideInFromBottom 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(186, 12, 47, 0.3);
        position: relative;
    `;
    
    const highlightsHtml = skill.highlights.map(highlight => 
        `<span style="background: #BA0C2F; color: white; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; margin-right: 0.5rem; margin-bottom: 0.5rem; display: inline-block;">${highlight}</span>`
    ).join('');
    
    content.innerHTML = `
        <h2 style="color: #FFD700; margin-bottom: 1.5rem; font-size: 2rem; font-weight: 700;">${skill.title}</h2>
        <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 2rem; line-height: 1.7; font-size: 1.1rem;">
            ${skill.description}
        </p>
        <div style="margin-bottom: 2.5rem;">
            ${highlightsHtml}
        </div>
        <button id="closeSkillModal" style="
            background: #002F8B;
            color: white;
            border: none;
            padding: 1rem 2.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 1rem;
        ">Got it!</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Add hover effect to button
    const closeButton = document.getElementById('closeSkillModal');
    closeButton.addEventListener('mouseenter', function() {
        this.style.background = '#006600';
    });
    closeButton.addEventListener('mouseleave', function() {
        this.style.background = '#002F8B';
    });
    
    // Close modal functionality
    closeButton.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeButton.click();
        }
    });
}

function trackPageLoad() {
    // Placeholder for analytics tracking
    console.log('digitaldias page loaded at:', new Date().toISOString());
    console.log('User agent:', navigator.userAgent);
    console.log('Screen resolution:', screen.width + 'x' + screen.height);
}

function trackContactClick(contactType, contactUrl) {
    // Placeholder for contact analytics tracking
    console.log('Contact clicked:', {
        type: contactType,
        url: contactUrl,
        timestamp: new Date().toISOString()
    });
}

function showContactFeedback(contactElement) {
    const contactName = contactElement.querySelector('span').textContent;
    const platform = contactName.toLowerCase();
    
    const messages = {
        email: '?? Opening email client...',
        linkedin: '?? Connecting on LinkedIn...',
        social: '?? Opening social profile...',
        'tech channel': '?? Opening YouTube channel...',
        photography: '?? Viewing photography portfolio...'
    };
    
    const message = messages[platform] || `?? Opening ${contactName}...`;
    
    // Create modern feedback message
    const feedbackEl = document.createElement('div');
    feedbackEl.textContent = message;
    feedbackEl.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: rgba(0, 0, 0, 0.9);
        color: #FFD700;
        padding: 1rem 2rem;
        border-radius: 16px;
        font-weight: 500;
        z-index: 1500;
        animation: slideInFromBottom 0.3s cubic-bezier(0.4, 0, 0.2, 1), fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) 2.5s forwards;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(10px);
        font-size: 0.9rem;
        border: 1px solid rgba(255, 215, 0, 0.3);
    `;
    
    document.body.appendChild(feedbackEl);
    
    setTimeout(() => {
        if (feedbackEl.parentNode) {
            feedbackEl.parentNode.removeChild(feedbackEl);
        }
    }, 2800);
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
        this.init();
    }

    init() {
        this.initLoading();
        this.initNavigation();
        this.initScrollAnimations();
        this.initCounters();
        this.initMagneticButtons();
        this.initTiltCards();
        this.initPhotoGallery();
        this.initThemeDetection();
        this.initParallax();
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

        // Smooth scroll
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    // Scroll animations
    initScrollAnimations() {
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
        const animatedElements = document.querySelectorAll(`
            .section-header,
            .expertise-card,
            .photo-item,
            .timeline-item,
            .contact-card,
            [data-animate]
        `);

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
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

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeOutExpo * target);
            
            numberElement.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    // Magnetic buttons - simplified without cursor dependency
    initMagneticButtons() {
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        
        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transition = 'transform 0.3s ease';
            });
            
            element.addEventListener('mousemove', (e) => {
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
                        window.open(imgSrc, '_blank');
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
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Animate in
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
            content.style.transform = 'scale(1)';
        });
        
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalDiasPortfolio();
    new ScrollReveal();
    
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