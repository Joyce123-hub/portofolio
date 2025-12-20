// Updated: modern text reveal, parallax scroll, ripple clicks, card tilt/depth + improved scroll reveals.

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initThemeToggle();
    initSmoothScroll();
    initNavbarScroll();
    initAnimations();
    initSkillAnimations();
    initProjectCards();
    initCVDownloadTracking();
    initClickEffects();
    initParallax();
    initScrollIndicator();
    initPerformanceOptimizations();
});

// Set your deployed Apps Script web app URL here (user-provided)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyLYOvAdXHDmcbQQtfklHZ-6nQ512j-N1wRmOqmctH0T8tGca99NcV3mjFl8uIDUPpIrg/exec';

// ------------------------ Page Transitions (Enhanced) ------------------------
function initPageTransitions() {
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        z-index: 9998;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    document.body.appendChild(overlay);

    // Fade in page on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    requestAnimationFrame(() => {
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Smooth fade-out on navigation with overlay effect
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        if (!link.href.includes('http') && !link.href.includes('#') && !link.classList.contains('no-transition')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetPage = this.getAttribute('href');
                
                // Trigger transition overlay and fade
                overlay.style.opacity = '0.95';
                document.body.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = targetPage;
                }, 500);
            });
        }
    });
}

// ------------------------ Theme Toggle ------------------------
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('i');

    // Default to dark theme
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(themeIcon, currentTheme);

    themeToggle.addEventListener('click', () => {
        const now = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', now);
        localStorage.setItem('theme', now);
        updateThemeIcon(themeIcon, now);
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => (document.body.style.transition = ''), 300);
    });
}

function updateThemeIcon(icon, theme) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ------------------------ Smooth Scroll ------------------------
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        });
    });
}

// ------------------------ Navbar Scroll ------------------------
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
}

// ------------------------ Modern UI Effects ------------------------

// reveal elements with stagger on scroll (improved)
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // optional stagger delay if data-delay set
                const delay = parseFloat(entry.target.dataset.delay) || 0;
                entry.target.style.transitionDelay = `${delay}s`;
                if (entry.target.dataset.once === "true") observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.animate-on-scroll, .section-title, .skill-item, .project-card, .rating-card, .hero-title, .hero-subtitle, .hero-description').forEach((el, idx) => {
        // small stagger default
        if (!el.dataset.delay) el.dataset.delay = (idx % 6) * 0.06;
        el.classList.add('will-animate');
        observer.observe(el);
    });
}

// subtle progress and number count animation for skills
function initSkillAnimations() {
    const items = document.querySelectorAll('.skill-item-with-progress');
    if (!items.length) return;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                const bar = entry.target.querySelector('.progress-bar');
                const val = bar ? bar.getAttribute('data-value') : null;
                if (bar && val) bar.style.width = `${val}%`;
                // count up numbers
                const num = entry.target.querySelector('.skill-percent');
                if (num && !num.dataset.started) {
                    animateNumber(num, 0, parseInt(num.dataset-to || val || 0), 900);
                    num.dataset.started = 'true';
                }
            }
        });
    }, { threshold: 0.25 });
    items.forEach(i => obs.observe(i));
}

function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function frame(now) {
        const p = Math.min(1, (now - start) / duration);
        const cur = Math.floor(from + (to - from) * p);
        el.textContent = cur + '%';
        if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// card tilt + depth + click pop + hover shadow
function initProjectCards() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 300ms cubic-bezier(.2,.9,.2,1), box-shadow 300ms ease';
        // pointer move tilt
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            const tiltX = (py - 0.5) * -8;
            const tiltY = (px - 0.5) * 12;
            card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(6px)`;
            card.style.boxShadow = `${(px-0.5)*30}px ${(py-0.5)*30}px 40px rgba(10,20,40,0.12)`;
        }, { passive: true });

        card.addEventListener('pointerleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });

        // click pop
        card.addEventListener('pointerdown', () => {
            card.style.transition = 'transform 120ms ease';
            card.style.transform = (card.style.transform ? card.style.transform + ' scale(0.98)' : 'scale(0.98)');
            setTimeout(() => { card.style.transition = 'transform 300ms cubic-bezier(.2,.9,.2,1), box-shadow 300ms ease'; card.style.transform = ''; }, 160);
        });

        // ripple on click for any .card-click elements inside
        card.querySelectorAll('.card-click, button, a').forEach(el => {
            el.addEventListener('click', createRipple);
        });
    });
}

// ------------------------ Parallax & Scroll micro-interactions ------------------------
function initParallax() {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;
    window.addEventListener('scroll', () => {
        const sc = window.scrollY;
        parallaxEls.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.2;
            el.style.transform = `translateY(${sc * speed * -1}px)`;
        });
    }, { passive: true });
}

// ------------------------ Click / ripple / focus effects ------------------------
function initClickEffects() {
    // buttons and links ripple
    document.querySelectorAll('button, .btn, a').forEach(el => {
        if (el.classList && el.classList.contains('no-ripple')) return;
        el.style.position = getComputedStyle(el).position === 'static' ? 'relative' : el.style.position;
        el.addEventListener('click', createRipple);
    });

    // soft focus ring for keyboard users
    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') document.documentElement.classList.add('show-focus');
    });
    document.body.addEventListener('mousedown', () => document.documentElement.classList.remove('show-focus'));
}

function createRipple(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 1.4;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    el.appendChild(ripple);
    requestAnimationFrame(() => ripple.classList.add('ripple-animate'));
    setTimeout(() => {
        ripple.classList.remove('ripple-animate');
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 700);
}

// ------------------------ CV Downloads ------------------------
function initCVDownloadTracking() {
    document.querySelectorAll('a[download]').forEach(link => {
        link.addEventListener('click', function () {
            const fileName = this.getAttribute('href') ? this.getAttribute('href').split('/').pop() : 'file';
            console.log('CV downloaded:', fileName);
            showDownloadToast(fileName);
        });
    });
}

function showDownloadToast(fileName) {
    const toast = document.createElement('div');
    toast.className = 'download-toast';
    toast.innerHTML = `<div class="toast-content"><i class="fas fa-check-circle text-success me-2"></i> Downloading ${fileName}...</div>`;
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--card-bg);color:var(--text-color);padding:1rem 1.5rem;border-radius:10px;box-shadow:var(--shadow);z-index:1000;animation:slideInRight .3s ease;';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOutRight .3s ease';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// ------------------------ Optional page load tasks ------------------------
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    testGoogleScriptConnection();
    // stagger hero items if present
    document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons').forEach((el, i) => {
        el.style.transition = 'opacity .8s ease, transform .8s ease';
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 180);
    });
});

function testGoogleScriptConnection() {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
        console.warn('Please set your Google Apps Script URL in the GOOGLE_SCRIPT_URL variable');
        return;
    }
    fetch(GOOGLE_SCRIPT_URL)
        .then(() => console.log('Google Apps Script is accessible'))
        .catch(err => console.warn('Cannot access Google Apps Script:', err));
}

// ------------------------ Inline styles used by JS animations (appended once) ------------------------
(function appendRuntimeStyles(){
    if (document.getElementById('runtime-js-styles')) return;
    const style = document.createElement('style');
    style.id = 'runtime-js-styles';
    style.textContent = `
        /* reveal + motion */
        .will-animate { opacity:0; transform: translateY(18px) scale(.995); transition: opacity .7s cubic-bezier(.2,.9,.2,1), transform .7s cubic-bezier(.2,.9,.2,1); }
        .animate-in { opacity:1; transform: translateY(0) scale(1); }
        /* small utility */
        .will-animate[data-delay] { transition-delay: 0s; }
        /* project card base */
        .project-card { backface-visibility: hidden; will-change: transform; border-radius:12px; overflow:hidden; cursor:pointer; }
        /* ripple */
        .ripple { position:absolute; border-radius:50%; pointer-events:none; transform:scale(0); opacity:0.16; background:var(--ripple, rgba(255,255,255,0.9)); transition:opacity .6s ease; }
        .ripple-animate { transform:scale(1); opacity:0; transition:transform .55s cubic-bezier(.2,.9,.2,1), opacity .6s ease; }
        /* focus ring for keyboard users */
        .show-focus :focus { outline: 3px solid rgba(59,130,246,0.28); outline-offset: 3px; border-radius:6px; }
        /* download toast */
        @keyframes slideInRight { from { transform: translateX(20px); opacity:0 } to { transform: translateX(0); opacity:1 } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity:1 } to { transform: translateX(20px); opacity:0 } }
        /* small clickable pop */
        .card-click { display:inline-block; overflow:hidden; position:relative; }
        /* simple responsive text shadow for headings */
        .section-title { text-rendering: optimizeLegibility; transition: text-shadow .5s ease; }
        .section-title:hover { text-shadow: 0 6px 18px rgba(10,20,40,0.12); }
        /* skill progress */
        .skill-item-with-progress .progress-bar { width: 0; transition: width 900ms cubic-bezier(.2,.9,.2,1); }
        /* subtle floating bg for cards */
        .project-card.float { animation: floatCard 6s ease-in-out infinite; }
        @keyframes floatCard { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) } }
    `;
    document.head.appendChild(style);
})();

// ------------------------ Scroll Progress Indicator ------------------------
function initScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'scroll-progress-bar';
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        z-index: 9999;
        width: 0%;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(79, 140, 245, 0.6);
    `;
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        indicator.style.width = scrolled + '%';
    }, { passive: true });
}

// ------------------------ Performance Optimizations & Professional Features ------------------------
function initPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    // Add keyboard navigation shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    });

    // Prefetch page resources
    prefetchResources();

    // Add page visibility API for better UX
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = '⏸ Portfolio';
        } else {
            document.title = 'John The Analyst - Portfolio';
        }
    });
}

// Prefetch navigation links for faster loading
function prefetchResources() {
    const links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(link => {
        if (!link.href.includes('http')) {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = link.href;
            document.head.appendChild(prefetchLink);
        }
    });
}

// Show keyboard shortcuts modal
function showKeyboardShortcuts() {
    const existingModal = document.getElementById('shortcuts-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card);
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
        animation: slideUp 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="color: var(--text);">
            <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.4rem;">⌨️ Keyboard Shortcuts</h3>
            <div style="color: var(--muted); font-size: 0.9rem; line-height: 1.8;">
                <div><strong>/</strong> - Show this help</div>
                <div><strong>Esc</strong> - Close this dialog</div>
                <div><strong>H</strong> - Go to Home</div>
                <div><strong>A</strong> - Go to About</div>
                <div><strong>P</strong> - Go to Projects</div>
                <div><strong>C</strong> - Go to Contact</div>
            </div>
            <button id="close-shortcuts" style="
                margin-top: 1.5rem;
                padding: 0.6rem 1rem;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                width: 100%;
            ">Close (Esc)</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = document.getElementById('close-shortcuts');
    const closeModal = () => {
        modal.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    }, { once: true });

    // Setup keyboard navigation
    setupKeyboardNavigation();
}

// Keyboard navigation between pages
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        
        const pageMap = {
            'h': 'index.html',
            'a': 'about.html',
            'p': 'projects.html',
            'c': 'contact.html'
        };
        
        if (pageMap[e.key.toLowerCase()]) {
            window.location.href = pageMap[e.key.toLowerCase()];
        }
    });
}