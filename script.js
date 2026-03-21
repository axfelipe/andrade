/**
 * Andrade Drywall Services - Final JavaScript
 * Optimized for direct leads via Phone + WhatsApp
 */

// ========================================
// HELPERS
// ========================================
function qs(selector, scope = document) {
    return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
}

// ========================================
// LANGUAGE SWITCHER
// ========================================
function applyLanguage(lang) {
    qsa('[data-en][data-pt]').forEach((el) => {
        const nextText = el.getAttribute(`data-${lang}`);
        if (!nextText) return;

        el.style.transition = 'opacity 0.15s ease';
        el.style.opacity = '0';

        window.setTimeout(() => {
            el.textContent = nextText;
            el.style.opacity = '1';
        }, 120);
    });

    document.documentElement.lang = lang;
    localStorage.setItem('preferredLanguage', lang);

    qsa('.lang-btn').forEach((btn) => btn.classList.remove('active'));
    const activeBtn = qs(`.lang-btn[onclick*="'${lang}'"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

function setLanguage(lang, clickedButton = null) {
    applyLanguage(lang);

    if (clickedButton) {
        qsa('.lang-btn').forEach((btn) => btn.classList.remove('active'));
        clickedButton.classList.add('active');
    }
}

// ========================================
// DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initSavedLanguage();
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initGalleryLightbox();
    initReveal();
    initTracking();
    initReducedMotion();
});

// ========================================
// LOAD SAVED LANGUAGE
// ========================================
function initSavedLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    applyLanguage(savedLang);
}

// ========================================
// MOBILE NAVIGATION
// ========================================
function initMobileMenu() {
    const menuToggle = qs('#menuToggle');
    const nav = qs('#nav');

    if (!menuToggle || !nav) return;

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        menuToggle.classList.add('active');
        nav.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = nav.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    qsa('a', nav).forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================
function initHeaderScroll() {
    const header = qs('#header');
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 24) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    const header = qs('#header');

    qsa('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = qs(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetTop = targetTop - headerHeight;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

// ========================================
// LIGHTBOX GALLERY
// ========================================
function initGalleryLightbox() {
    qsa('.gallery-item').forEach((item) => {
        item.addEventListener('click', () => {
            const img = qs('img', item);
            if (!img) return;

            const existing = qs('.lightbox');
            if (existing) existing.remove();

            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="lightbox-close" aria-label="Close image">&times;</button>
                </div>
            `;

            Object.assign(lightbox.style, {
                position: 'fixed',
                inset: '0',
                zIndex: '10000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });

            const overlay = qs('.lightbox-overlay', lightbox);
            Object.assign(overlay.style, {
                position: 'absolute',
                inset: '0',
                background: 'rgba(0,0,0,0.88)'
            });

            const content = qs('.lightbox-content', lightbox);
            Object.assign(content.style, {
                position: 'relative',
                zIndex: '2',
                maxWidth: '90%',
                maxHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });

            const lightboxImg = qs('img', lightbox);
            Object.assign(lightboxImg.style, {
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
            });

            const closeBtn = qs('.lightbox-close', lightbox);
            Object.assign(closeBtn.style, {
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#ffffff',
                color: '#000000',
                fontSize: '28px',
                lineHeight: '1',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            });

            const closeLightbox = () => {
                lightbox.remove();
                document.body.style.overflow = '';
            };

            closeBtn.addEventListener('click', closeLightbox);
            overlay.addEventListener('click', closeLightbox);

            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', escHandler);
                }
            };

            document.addEventListener('keydown', escHandler);

            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
        });
    });
}

// ========================================
// SCROLL REVEAL
// ========================================
function initReveal() {
    const elements = qsa('.service-card, .gallery-item, .contact-card, .contact-form-wrapper, .feature');

    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        elements.forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    elements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const revealElement = (el) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        elements.forEach((el) => observer.observe(el));
    } else {
        elements.forEach(revealElement);
    }
}

// ========================================
// BASIC EVENT TRACKING
// ========================================
function trackEvent(eventName, eventData = {}) {
    console.log('Tracked:', eventName, eventData);
}

function initTracking() {
    qsa('.btn-primary, .btn-whatsapp-header, .floating-whatsapp').forEach((btn) => {
        btn.addEventListener('click', () => {
            trackEvent('whatsapp_or_primary_click', {
                text: btn.textContent.trim(),
                href: btn.getAttribute('href') || ''
            });
        });
    });

    qsa('a[href^="tel:"]').forEach((link) => {
        link.addEventListener('click', () => {
            trackEvent('phone_click', {
                phone: link.getAttribute('href')
            });
        });
    });

    qsa('.nav-list a').forEach((link) => {
        link.addEventListener('click', () => {
            trackEvent('nav_click', {
                target: link.getAttribute('href')
            });
        });
    });
}

// ========================================
// REDUCED MOTION SUPPORT
// ========================================
function initReducedMotion() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.documentElement.style.scrollBehavior = 'auto';

    const style = document.createElement('style');
    style.textContent = `
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

console.log('Andrade Drywall Services loaded successfully.');