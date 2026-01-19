/**
 * Sigurdsen Maskin - Main JavaScript
 * Maskinentreprenør i Hommersåk, Sandnes
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const mobileMenu = document.querySelector('.mobile-menu');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.querySelector('.form-message');

    // ==========================================================================
    // Mobile Navigation
    // ==========================================================================
    function initMobileNav() {
        if (!navToggle) return;

        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');

            // Toggle nav list for simple menu
            if (navList) {
                navList.classList.toggle('active');
            }

            // Toggle mobile menu overlay
            if (mobileMenu) {
                mobileMenu.classList.toggle('active');
            }

            // Prevent body scroll when menu is open
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navToggle.classList.contains('active')) {
                    navToggle.click();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navToggle.classList.contains('active')) {
                navToggle.click();
            }
        });
    }

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add scrolled class when scrolled past threshold
            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                // Skip if it's just "#"
                if (targetId === '#') return;

                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;

                    window.scrollTo({
                        top: targetPosition - headerHeight - 20,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==========================================================================
    // Contact Form Handling
    // ==========================================================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Get form data
            const formData = {
                name: this.querySelector('[name="name"]').value,
                email: this.querySelector('[name="email"]').value,
                phone: this.querySelector('[name="phone"]').value,
                address: this.querySelector('[name="address"]')?.value || '',
                projectType: this.querySelector('[name="projectType"]')?.value || '',
                message: this.querySelector('[name="message"]').value,
                siteVisit: this.querySelector('[name="siteVisit"]')?.checked || false
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.message) {
                showFormMessage('Vennligst fyll ut alle påkrevde felt.', 'error');
                return;
            }

            // Validate email format
            if (!isValidEmail(formData.email)) {
                showFormMessage('Vennligst skriv inn en gyldig e-postadresse.', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Sender...';

            try {
                // Simulate form submission (replace with actual API call)
                await simulateFormSubmission(formData);

                // Show success message
                showFormMessage('Takk for din henvendelse! Vi tar kontakt så snart som mulig.', 'success');

                // Reset form
                contactForm.reset();
            } catch (error) {
                // Show error message
                showFormMessage('Beklager, noe gikk galt. Vennligst prøv igjen eller ring oss direkte.', 'error');
                console.error('Form submission error:', error);
            } finally {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    function showFormMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = `form-message form-message--${type} show`;

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 5000);
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function simulateFormSubmission(data) {
        // Simulate API call delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // In production, this would be an actual API call
                // For now, just log the data and resolve
                console.log('Form data:', data);
                resolve({ success: true });
            }, 1500);
        });
    }

    // ==========================================================================
    // Scroll Reveal Animation
    // ==========================================================================
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');

        if (reveals.length === 0) return;

        const revealOnScroll = () => {
            reveals.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                const revealPoint = 150;

                if (elementTop < windowHeight - revealPoint) {
                    element.classList.add('visible');
                }
            });
        };

        // Initial check
        revealOnScroll();

        // On scroll
        window.addEventListener('scroll', revealOnScroll, { passive: true });
    }

    // ==========================================================================
    // Project Category Filter (for prosjekter.html)
    // ==========================================================================
    function initProjectFilter() {
        const categories = document.querySelectorAll('.project-category');
        const projects = document.querySelectorAll('.project-card');

        if (categories.length === 0 || projects.length === 0) return;

        categories.forEach(category => {
            category.addEventListener('click', function() {
                // Update active state
                categories.forEach(c => c.classList.remove('active'));
                this.classList.add('active');

                const filter = this.dataset.category;

                // Filter projects
                projects.forEach(project => {
                    if (filter === 'all' || project.dataset.category === filter) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================================================
    // Active Navigation Link
    // ==========================================================================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav__link');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');

            if (currentPath.endsWith(linkPath) ||
                (linkPath === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // Click to Call Tracking (for analytics)
    // ==========================================================================
    function initCallTracking() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track click (can be connected to analytics)
                console.log('Phone call initiated');

                // Could be extended with Google Analytics, etc.
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'Phone Call'
                    });
                }
            });
        });
    }

    // ==========================================================================
    // Lazy Load Images
    // ==========================================================================
    function initLazyLoad() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px 0px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ==========================================================================
    // Current Year in Footer
    // ==========================================================================
    function updateYear() {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();

        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }

    // ==========================================================================
    // Service Card Hover Effect (touch devices)
    // ==========================================================================
    function initTouchHover() {
        // Check if touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (!isTouchDevice) return;

        const cards = document.querySelectorAll('.service-card, .project-card');

        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                // Remove hover class from other cards
                cards.forEach(c => c.classList.remove('touch-hover'));
                // Add hover class to this card
                this.classList.add('touch-hover');
            });
        });

        // Remove hover when touching elsewhere
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.service-card, .project-card')) {
                cards.forEach(c => c.classList.remove('touch-hover'));
            }
        });
    }

    // ==========================================================================
    // Form Input Floating Labels (optional enhancement)
    // ==========================================================================
    function initFloatingLabels() {
        const inputs = document.querySelectorAll('.form-input, .form-textarea');

        inputs.forEach(input => {
            // Check if input has value on load
            if (input.value) {
                input.classList.add('has-value');
            }

            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    }

    // ==========================================================================
    // Initialize All Functions
    // ==========================================================================
    function init() {
        initMobileNav();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initScrollReveal();
        initProjectFilter();
        setActiveNavLink();
        initCallTracking();
        initLazyLoad();
        updateYear();
        initTouchHover();
        initFloatingLabels();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
