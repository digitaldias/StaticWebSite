document.addEventListener("DOMContentLoaded",()=>{initializePage(),startSubtleAnimations()});function initializePage(){console.log("digitaldias website loaded successfully!"),trackPageLoad()}const motionPreferenceQuery=window.matchMedia("(prefers-reduced-motion: reduce)");function userPrefersReducedMotion(){return motionPreferenceQuery.matches}motionPreferenceQuery.addEventListener("change",e=>{e.matches||startSubtleAnimations()});function startSubtleAnimations(){if(userPrefersReducedMotion())return;createMinimalParticles()}function createMinimalParticles(){const e=4;for(let t=0;t<e;t++)setTimeout(()=>{const e=document.createElement("div");e.style.cssText=`
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(255, 215, 0, 0.18);
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
                animation: subtleFloat ${18+Math.random()*12}s linear infinite;
                left: ${Math.random()*100}vw;
                top: ${Math.random()*100}vh;
            `,document.body.appendChild(e);const t=()=>{e.parentNode&&e.parentNode.removeChild(e)};setTimeout(t,3e4),window.addEventListener("pagehide",t,{once:!0})},t*2e3)}function trackPageLoad(){console.log("digitaldias page loaded at:",(new Date).toISOString()),console.log("User agent:",navigator.userAgent),console.log("Screen resolution:",screen.width+"x"+screen.height)}function addModernStyles(){const e=document.createElement("style");e.textContent=`
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
    `,document.head.appendChild(e)}addModernStyles();class DigitalDiasPortfolio{constructor(){this.motionQuery=window.matchMedia("(prefers-reduced-motion: reduce)"),this.prefersReducedMotion=this.motionQuery.matches,this.motionQuery.addEventListener("change",e=>{this.prefersReducedMotion=e.matches,e.matches&&(this.showElementsWithoutAnimation(),this.setCountersImmediately())}),this.init()}init(){this.initLoading(),this.initNavigation(),this.prefersReducedMotion?(this.showElementsWithoutAnimation(),this.setCountersImmediately()):this.initScrollAnimations(),this.initCounters(),this.prefersReducedMotion||(this.initMagneticButtons(),this.initTiltCards(),this.initParallax()),this.initPhotoGallery(),this.initThemeDetection()}initLoading(){const e=document.querySelector(".loading-screen");setTimeout(()=>{e&&(e.classList.add("hidden"),setTimeout(()=>{e.remove()},500))},1500)}initNavigation(){const t=document.querySelector("[data-nav]"),s=document.querySelectorAll("[data-nav-link]"),e=document.querySelector("[data-nav-toggle]"),n=document.querySelector("[data-nav-menu]");if(!t)return;window.addEventListener("scroll",()=>{const e=window.scrollY;e>100?(t.style.background="rgba(10, 10, 10, 0.98)",t.style.backdropFilter="blur(20px)"):(t.style.background="rgba(10, 10, 10, 0.95)",t.style.backdropFilter="blur(16px)")});const i=document.querySelectorAll("section[id]"),o=()=>{const e=window.scrollY+200;i.forEach(t=>{const n=t.offsetTop,o=t.offsetHeight,i=t.getAttribute("id");e>=n&&e<n+o&&s.forEach(e=>{e.classList.remove("active"),e.getAttribute("href")===`#${i}`&&e.classList.add("active")})})};window.addEventListener("scroll",o),o(),s.forEach(t=>{t.addEventListener("click",s=>{const o=t.getAttribute("href");if(o){const e=new URL(o,window.location.href),t=e.hash?e.hash.substring(1):null,i=o.startsWith("#")||e.pathname===window.location.pathname,n=t?document.getElementById(t):null;n&&i&&(s.preventDefault(),n.scrollIntoView({behavior:"smooth",block:"start"}))}e&&n&&(e.setAttribute("aria-expanded","false"),e.classList.remove("active"),n.classList.remove("active"))})}),e&&n&&e.addEventListener("click",()=>{const t=e.getAttribute("aria-expanded")==="true";e.setAttribute("aria-expanded",(!t).toString()),e.classList.toggle("active",!t),n.classList.toggle("active",!t)})}initScrollAnimations(){if(this.prefersReducedMotion){this.showElementsWithoutAnimation(),this.setCountersImmediately();return}const e={threshold:.1,rootMargin:"0px 0px -50px 0px"},t=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting&&(e.target.style.opacity="1",e.target.style.transform="translateY(0)",e.target.hasAttribute("data-animate")&&this.animateCounter(e.target),e.target.classList.contains("expertise-grid")||e.target.classList.contains("photo-masonry"))){const t=e.target.children;Array.from(t).forEach((e,t)=>{setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},t*100)})}})},e),n=document.querySelectorAll(this.getAnimatedSelector());n.forEach(e=>{e.style.opacity="0",e.style.transform="translateY(30px)",e.style.transition="all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",t.observe(e)})}getAnimatedSelector(){return`
            .section-header,
            .expertise-card,
            .photo-item,
            .timeline-item,
            .contact-card,
            [data-animate]
        `}showElementsWithoutAnimation(){const e=document.querySelectorAll(this.getAnimatedSelector());e.forEach(e=>{e.style.opacity="1",e.style.transform="none",e.style.transition="none"})}setCountersImmediately(){const e=document.querySelectorAll("[data-animate] .stat-number");e.forEach(e=>{const t=e.closest("[data-animate]"),n=t?t.getAttribute("data-target"):null;t&&n&&(e.textContent=n)})}initCounters(){}animateCounter(e){const n=parseInt(e.getAttribute("data-target")),t=e.querySelector(".stat-number"),o=2e3,i=performance.now();if(e.classList.contains("infinity-stat"))return;if(this.prefersReducedMotion){t&&(t.textContent=n);return}const s=e=>{const r=e-i,a=Math.min(r/o,1),c=a===1?1:1-2**(-10*a),l=Math.floor(c*n);t&&(t.textContent=l),a<1?requestAnimationFrame(s):t&&(t.textContent=n)};requestAnimationFrame(s)}initMagneticButtons(){const e=document.querySelectorAll("[data-magnetic]");if(!e.length)return;e.forEach(e=>{e.addEventListener("mouseenter",()=>{if(this.prefersReducedMotion){e.style.transform="translate(0, 0)";return}e.style.transition="transform 0.3s ease"}),e.addEventListener("mousemove",t=>{if(this.prefersReducedMotion){e.style.transform="translate(0, 0)";return}const n=e.getBoundingClientRect(),s=t.clientX-n.left-n.width/2,o=t.clientY-n.top-n.height/2,i=s*.15,a=o*.15;e.style.transform=`translate(${i}px, ${a}px)`}),e.addEventListener("mouseleave",()=>{e.style.transform="translate(0, 0)",e.style.transition="transform 0.5s ease"})})}initTiltCards(){const e=document.querySelectorAll("[data-tilt]");e.forEach(e=>{e.addEventListener("mousemove",t=>{if(this.prefersReducedMotion){e.style.transform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";return}const n=e.getBoundingClientRect(),i=t.clientX-n.left,a=t.clientY-n.top,s=n.width/2,o=n.height/2,r=(a-o)/o*-10,c=(i-s)/s*10;e.style.transform=`perspective(1000px) rotateX(${r}deg) rotateY(${c}deg) scale3d(1.02, 1.02, 1.02)`}),e.addEventListener("mouseleave",()=>{e.style.transform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"})})}initPhotoGallery(){const e=document.querySelectorAll(".photo-item");e.forEach(e=>{const t=e.querySelector("img");if(!t)return;if(t&&t.hasAttribute("loading")){const e=new IntersectionObserver(t=>{t.forEach(t=>{if(t.isIntersecting){const n=t.target;n.src=n.src,n.classList.add("loaded"),e.unobserve(n)}})});e.observe(t)}const n=e.querySelectorAll("[data-action]");n.forEach(e=>{e.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const s=e.getAttribute("data-action"),o=t.src;if(s==="view")this.openLightbox(o);else if(s==="external"){const e=window.open(o,"_blank","noopener");e&&(e.opener=null)}})})})}openLightbox(e){const t=document.createElement("div");t.className="lightbox",t.innerHTML=`
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-content">
                <img src="${e}" alt="Gallery image">
                <button class="lightbox-close">&times;</button>
            </div>
        `,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.style.cssText=`
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;const i=t.querySelector(".lightbox-backdrop");i.style.cssText=`
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
        `;const n=t.querySelector(".lightbox-content");n.style.cssText=`
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `,n.setAttribute("role","document");const a=t.querySelector("img");a.style.cssText=`
            max-width: 100%;
            max-height: 100%;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        `;const s=t.querySelector(".lightbox-close");s.style.cssText=`
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
        `,s.setAttribute("aria-label","Close image preview"),document.body.appendChild(t),document.body.style.overflow="hidden",requestAnimationFrame(()=>{t.style.opacity="1",n.style.transform="scale(1)"}),s.focus();const o=()=>{t.style.opacity="0",n.style.transform="scale(0.8)",document.body.style.overflow="",setTimeout(()=>{t.remove()},300)};s.addEventListener("click",o),i.addEventListener("click",o),document.addEventListener("keydown",e=>{e.key==="Escape"&&o()})}initThemeDetection(){const e=window.matchMedia("(prefers-color-scheme: dark)");e.addEventListener("change",e=>{console.log("Theme changed to:",e.matches?"dark":"light")})}initParallax(){const e=document.querySelectorAll(".photo-tile");window.addEventListener("scroll",()=>{if(this.prefersReducedMotion){e.forEach(e=>{e.style.transform="none"});return}const t=window.pageYOffset,n=t*.3;e.forEach((e,t)=>{const s=t%3*.1+.1;e.style.transform=`translateY(${n*s}px)`})})}debounce(e,t){let n;return function(...s){const o=()=>{clearTimeout(n),e(...s)};clearTimeout(n),n=setTimeout(o,t)}}throttle(e,t){let n;return function(){const s=arguments,o=this;n||(e.apply(o,s),n=!0,setTimeout(()=>n=!1,t))}}}class ScrollReveal{constructor(){this.observer=new IntersectionObserver(this.handleIntersection.bind(this),{threshold:.1,rootMargin:"0px 0px -50px 0px"}),this.init()}init(){const e=document.querySelectorAll(`
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
        `);e.forEach(e=>{e.style.opacity="0",e.style.transform="translateY(30px)",e.style.transition="all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",this.observer.observe(e)})}handleIntersection(e){e.forEach(e=>{e.isIntersecting&&(e.target.style.opacity="1",e.target.style.transform="translateY(0)",this.observer.unobserve(e.target))})}}document.addEventListener("DOMContentLoaded",()=>{new DigitalDiasPortfolio,new ScrollReveal,window.addEventListener("load",()=>{document.body.classList.add("loaded")}),"performance"in window&&"measure"in performance&&window.addEventListener("load",()=>{setTimeout(()=>{const e=performance.getEntriesByType("navigation")[0];console.log(`Page load time: ${e.loadEventEnd-e.loadEventStart}ms`)},0)})}),window.addEventListener("error",e=>{console.error("JavaScript error:",e.error)}),window.addEventListener("unhandledrejection",e=>{console.error("Unhandled promise rejection:",e.reason),e.preventDefault()}),typeof module!="undefined"&&module.exports&&(module.exports={DigitalDiasPortfolio,ScrollReveal})