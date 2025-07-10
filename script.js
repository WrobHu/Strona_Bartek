// === MOBILE MENU - znacznie ulepszone ===
    initializeMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mainNav = document.getElementById('main-nav');
        const header = document.querySelector('.main-header');

        if (!hamburgerBtn || !mainNav) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Ensure hamburger structure
        this.ensureHamburgerStructure(hamburgerBtn);

        // State management
        let isOpen = false;

        const toggleMenu = (open = !isOpen) => {
            isOpen = open;
            
            hamburgerBtn.classList.toggle('active', isOpen);
            mainNav.classList.toggle('mobile-active', isOpen);
            header?.classList.toggle('nav-open', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
            
            // Accessibility
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
            mainNav.setAttribute('aria-hidden', !isOpen);
            
            // Focus management
            if (isOpen) {
                // Focus first nav item when opened
                const firstNavItem = mainNav.querySelector('a');
                if (firstNavItem) {
                    setTimeout(() => firstNavItem.focus(), 100);
                }
            }
            
            // Prevent body scroll when menu is open
            if (isOpen) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            } else {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }
        };

        const closeMenu = () => {
            toggleMenu(false);
            hamburgerBtn.focus(); // Return focus to hamburger button
        };

        // Event listeners
        hamburgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close on nav link click with smooth transition
        mainNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && isOpen) {
                // Add smooth closing animation
                e.target.style.background = 'var(--color-accent)';
                e.target.style.color = 'white';
                e.target.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    closeMenu();
                }, 150);
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (isOpen && 
                !mainNav.contains(e.target) && 
                !hamburgerBtn.contains(e.target)) {
                closeMenu();
            }
        });

        // Close on escape with better UX
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
            
            // Trap focus within menu when open
            if (isOpen && e.key === 'Tab') {
                const focusableElements = mainNav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });

        // Close on resize to desktop with cleanup
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && isOpen) {
                    closeMenu();
                }
            }, 100);
        }, { passive: true });

        // Handle orientation change on mobile
        window.addEventListener('orientationchange', () => {
            if (isOpen) {
                setTimeout(() => {
                    // Recalculate menu height after orientation change
                    const navHeight = `calc(100vh - ${header.offsetHeight}px)`;
                    mainNav.style.height = navHeight;
                }, 500);
            }
        });

        console.log('✅ Enhanced mobile menu initialized');
    }

    ensureHamburgerStructure(button) {
        if (!button.querySelector('.hamburger-line')) {
            button.innerHTML = `
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            `;
        }
        
        // Enhanced accessibility attributes
        button.setAttribute('aria-label', 'Toggle navigation menu');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', 'main-nav');
    }

    // === ENHANCED TOUCH SUPPORT ===
    initializeTouchSupport() {
        // Better touch handling for mobile devices
        let touchStartY = 0;
        let touchEndY = 0;

        // Handle swipe gestures
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipeGesture();
        }, { passive: true });

        // Prevent zoom on double tap for buttons
        const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-cta');
        buttons.forEach(button => {
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.click();
            });
        });
    }

    handleSwipeGesture() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            // Close mobile menu on upward swipe
            if (diff > 0) {
                const hamburgerBtn = document.getElementById('hamburger-btn');
                if (hamburgerBtn && hamburgerBtn.classList.contains('active')) {
                    hamburgerBtn.click();
                }
            }
        }
    }

    // === IMPROVED SCROLL EFFECTS ===
    initializeScrollEffects() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        // Enhanced reveal animation with stagger
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add stagger delay for grid items
                    const delay = element.closest('.features-grid, .pricing-grid, .testimonials-grid') 
                        ? index * 100 : 0;
                    
                    setTimeout(() => {
                        element.style.animation = 'fadeIn 0.6s ease-out forwards';
                        element.classList.add('revealed');
                    }, delay);
                    
                    revealObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        // Observe elements with better performance
        const revealElements = document.querySelectorAll('.reveal-element, .feature-item, .pricing-card, .testimonial-card');
        revealElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            revealObserver.observe(element);
        });

        // Enhanced parallax for better mobile performance
        if (window.innerWidth > 768) {
            const parallaxObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.setupParallax(entry.target);
                    }
                });
            });

            document.querySelectorAll('.image-parallax').forEach(img => {
                parallaxObserver.observe(img);
            });
        }

        this.observers.set('reveal', revealObserver);
        
        console.log('✅ Enhanced scroll effects initialized');
    }

    // === ENHANCED MOUSE GRADIENT ===
    initializeMouseGradient() {
        const gradient = document.querySelector('.mouse-gradient-background');
        if (!gradient) return;

        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;

        const updateGradient = () => {
            const x = mouseX - 200;
            const y = mouseY - 200;
            gradient.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            isMoving = false;
        };

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMoving) {
                requestAnimationFrame(updateGradient);
                isMoving = true;
            }
        };

        // Only on desktop and when user prefers motion
        if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
            
            // Hide on mobile/touch devices
            if ('ontouchstart' in window) {
                gradient.style.display = 'none';
            }
        } else {
            gradient.style.display = 'none';
        }

        console.log('✅ Enhanced mouse gradient initialized');
    }

    // === ENHANCED PERFORMANCE OPTIMIZATIONS ===
    initializePerformanceOptimizations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-normal', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
            
            // Remove all animations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Enhanced lazy loading with better UX
        this.setupLazyLoading();

        // Preload critical resources
        this.preloadCriticalResources();

        // Setup enhanced resize handler
        this.setupResizeHandler();

        // Initialize touch support
        this.initializeTouchSupport();

        // Optimize for different connection speeds
        this.optimizeForConnection();

        // Add loading states
        this.addLoadingStates();

        console.log('✅ Enhanced performance optimizations initialized');
    }

    optimizeForConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // Disable animations and effects for slow connections
                document.body.classList.add('slow-connection');
                
                // Remove floating words
                const floatingContainer = document.getElementById('floating-words-container');
                if (floatingContainer) {
                    floatingContainer.style.display = 'none';
                }
                
                // Reduce image quality
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    if (img.src && img.src.includes('unsplash')) {
                        img.src = img.src.replace('q=80', 'q=50');
                    }
                });
            }
        }
    }

    addLoadingStates() {
        // Add loading states to forms and buttons
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                }
            });
        });

        // Add loading states to navigation
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.hostname === window.location.hostname) {
                    link.classList.add('loading');
                }
            });
        });
    }

    setupResizeHandler() {
        let resizeTimeout;
        
        const handleResize = this.debounce(() => {
            // Recalculate floating words on resize
            if (window.innerWidth <= 768) {
                const container = document.getElementById('floating-words-container');
                if (container) {
                    container.innerHTML = '';
                }
            } else if (window.innerWidth > 768) {
                this.initializeFloatingWords();
            }
            
            // Update mouse gradient
            this.initializeMouseGradient();
            
            // Update mobile menu height
            const mainNav = document.getElementById('main-nav');
            const header = document.querySelector('.main-header');
            if (mainNav && mainNav.classList.contains('mobile-active')) {
                const navHeight = `calc(100vh - ${header.offsetHeight}px)`;
                mainNav.style.height = navHeight;
            }
        }, 250);

        window.addEventListener('resize', handleResize, { passive: true });
    }// === ELEGANCKI I WYDAJNY JAVASCRIPT - BARTŁOMIEJ PŁÓCIENNIK ===

class ElegantApp {
    constructor() {
        this.isInitialized = false;
        this.animations = new Map();
        this.observers = new Map();
        this.rafId = null;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize(), { once: true });
        } else {
            this.initialize();
        }
    }

    initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing elegant app...');
        
        try {
            // Core functionality
            this.initializeHeader();
            this.initializeMobileMenu();
            this.initializeForm();
            this.initializeCTAPopup();
            this.initializeScrollEffects();
            this.initializeSmoothScroll();
            this.initializeMouseGradient();
            this.initializeFloatingWords();
            this.initializePerformanceOptimizations();
            
            this.isInitialized = true;
            console.log('✅ App initialized successfully');
        } catch (error) {
            console.error('❌ App initialization failed:', error);
        }
    }

    // === HEADER & SCROLL EFFECTS ===
    initializeHeader() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let lastScrollY = window.pageYOffset;
        let isScrolled = false;

        const updateHeader = () => {
            const currentScrollY = window.pageYOffset;
            const scrolledNow = currentScrollY > 50;

            if (scrolledNow !== isScrolled) {
                isScrolled = scrolledNow;
                header.classList.toggle('scrolled', isScrolled);
            }

            lastScrollY = currentScrollY;
        };

        // Throttled scroll handler
        let scrollTimeout;
        const handleScroll = () => {
            if (!scrollTimeout) {
                scrollTimeout = requestAnimationFrame(() => {
                    updateHeader();
                    scrollTimeout = null;
                });
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        console.log('✅ Header scroll effects initialized');
    }

    // === MOBILE MENU ===
    initializeMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mainNav = document.getElementById('main-nav');
        const header = document.querySelector('.main-header');

        if (!hamburgerBtn || !mainNav) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Ensure hamburger structure
        this.ensureHamburgerStructure(hamburgerBtn);

        // State management
        let isOpen = false;

        const toggleMenu = (open = !isOpen) => {
            isOpen = open;
            
            hamburgerBtn.classList.toggle('active', isOpen);
            mainNav.classList.toggle('mobile-active', isOpen);
            header?.classList.toggle('nav-open', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
            
            // Accessibility
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
            mainNav.setAttribute('aria-hidden', !isOpen);
        };

        const closeMenu = () => toggleMenu(false);

        // Event listeners
        hamburgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close on nav link click
        mainNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && isOpen) {
                closeMenu();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (isOpen && 
                !mainNav.contains(e.target) && 
                !hamburgerBtn.contains(e.target)) {
                closeMenu();
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
                hamburgerBtn.focus();
            }
        });

        // Close on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isOpen) {
                closeMenu();
            }
        }, { passive: true });

        console.log('✅ Mobile menu initialized');
    }

    ensureHamburgerStructure(button) {
        if (!button.querySelector('.hamburger-line')) {
            button.innerHTML = `
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            `;
        }
        
        // Accessibility attributes
        button.setAttribute('aria-label', 'Toggle navigation menu');
        button.setAttribute('aria-expanded', 'false');
    }

    // === FORMULARZ ===
    initializeForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        console.log('✅ Initializing elegant form...');

        const elements = this.getFormElements(form);
        
        // Setup form handlers
        this.setupPhoneFormatting(elements.phoneInput);
        this.setupGoalSelection(elements);
        this.setupValidation(form);
        this.setupFormSubmission(form, elements);

        console.log('✅ Form initialized');
    }

    getFormElements(form) {
        return {
            form,
            submitButton: form.querySelector('.btn-submit'),
            successState: document.getElementById('form-success-state'),
            mainError: document.getElementById('form-main-error'),
            phoneInput: document.getElementById('phone'),
            goalRadios: form.querySelectorAll('input[name="goal"]'),
            otherGoalWrapper: document.getElementById('other-goal-wrapper'),
            otherGoalInput: document.getElementById('other-goal-text')
        };
    }

    setupPhoneFormatting(phoneInput) {
        if (!phoneInput) return;
        
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '').substring(0, 9);
            e.target.value = value.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
        });
    }

    setupGoalSelection(elements) {
        const { goalRadios, otherGoalWrapper, otherGoalInput } = elements;
        
        goalRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const isOther = radio.value === 'inny' && radio.checked;
                
                if (otherGoalWrapper) {
                    otherGoalWrapper.style.display = isOther ? 'block' : 'none';
                }
                
                if (otherGoalInput) {
                    otherGoalInput.required = isOther;
                    if (!isOther) otherGoalInput.value = '';
                }
            });
        });
    }

    setupValidation(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const errorSpan = field.closest('.form-group')?.querySelector('.error-message');
        let isValid = true;
        let message = '';

        // Validation rules
        if (field.required && !value) {
            isValid = false;
            message = 'To pole jest wymagane.';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Proszę podać poprawny adres e-mail.';
            }
        } else if (field.type === 'tel' && value) {
            const phoneNumber = value.replace(/\s/g, '');
            if (phoneNumber.length < 9) {
                isValid = false;
                message = 'Numer telefonu musi mieć co najmniej 9 cyfr.';
            }
        }

        // Update field appearance
        field.classList.remove('valid', 'error');
        if (isValid && value) {
            field.classList.add('valid');
        } else if (!isValid) {
            field.classList.add('error');
        }

        // Show/hide error message
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.toggle('visible', !isValid && message);
        }

        return isValid;
    }

    setupFormSubmission(form, elements) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmit(elements);
        });
    }

    async handleFormSubmit(elements) {
        const { form, submitButton, successState, mainError } = elements;
        
        // Validate all fields
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Check goal selection
        const goalSelected = form.querySelector('input[name="goal"]:checked');
        if (!goalSelected) {
            isValid = false;
            this.showFieldError('goal', 'Proszę wybrać cel nauki.');
        }

        if (!isValid) {
            this.showMainError(mainError, 'Proszę uzupełnić wszystkie wymagane pola.');
            return;
        }

        // Hide main error
        this.hideMainError(mainError);

        // Update submit button
        this.setSubmitButtonState(submitButton, true, 'Wysyłanie...');

        try {
            // Simulate form submission
            await this.simulateFormSubmission();
            this.showFormSuccess(form, successState);
            
        } catch (error) {
            console.error('Form submission failed:', error);
            this.showMainError(mainError, 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.');
        } finally {
            this.setSubmitButtonState(submitButton, false, 'Wyślij wiadomość');
        }
    }

    showFieldError(fieldName, message) {
        const field = document.querySelector(`input[name="${fieldName}"]`);
        const errorSpan = field?.closest('.form-group')?.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('visible');
        }
    }

    showMainError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
    }

    hideMainError(errorElement) {
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    }

    setSubmitButtonState(button, isLoading, text) {
        if (!button) return;
        
        button.disabled = isLoading;
        const buttonText = button.querySelector('.btn-text') || button;
        buttonText.textContent = text;
    }

    async simulateFormSubmission() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    showFormSuccess(form, successState) {
        if (!successState) return;

        // Animate form out
        form.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        form.style.opacity = '0';
        form.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            form.style.display = 'none';
            successState.style.visibility = 'visible';
            successState.style.opacity = '1';
            successState.classList.add('visible');
        }, 500);
    }

    // === CTA POPUP ===
    initializeCTAPopup() {
        const popup = document.getElementById('cta-popup');
        if (!popup) return;

        const openBtn = document.getElementById('cta-open-btn');
        const closeBtn = document.getElementById('cta-close-btn');
        const modal = popup.querySelector('.cta-modal');

        if (!openBtn || !closeBtn || !modal) return;

        let isOpen = false;

        const openModal = () => {
            if (isOpen) return;
            isOpen = true;
            
            openBtn.style.display = 'none';
            modal.style.display = 'block';
            
            requestAnimationFrame(() => {
                modal.style.opacity = '1';
                modal.style.transform = 'scale(1)';
                modal.classList.add('visible');
            });
        };

        const closeModal = () => {
            if (!isOpen) return;
            isOpen = false;
            
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.8)';
            modal.classList.remove('visible');
            
            setTimeout(() => {
                modal.style.display = 'none';
                openBtn.style.display = 'flex';
            }, 250);
        };

        // Event listeners
        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        
        // Close on outside click
        popup.addEventListener('click', (e) => {
            if (e.target === popup && isOpen) {
                closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeModal();
            }
        });

        console.log('✅ CTA popup initialized');
    }

    // === SCROLL EFFECTS & ANIMATIONS ===
    initializeScrollEffects() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        // Reveal animation observer
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.animation = 'fadeIn 0.6s ease-out forwards';
                    element.classList.add('revealed');
                    revealObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for reveal animation
        const revealElements = document.querySelectorAll('.reveal-element, .feature-item, .pricing-card, .testimonial-card');
        revealElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            revealObserver.observe(element);
        });

        // Parallax effect for images
        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setupParallax(entry.target);
                }
            });
        });

        document.querySelectorAll('.image-parallax').forEach(img => {
            parallaxObserver.observe(img);
        });

        this.observers.set('reveal', revealObserver);
        this.observers.set('parallax', parallaxObserver);
        
        console.log('✅ Scroll effects initialized');
    }

    setupParallax(element) {
        let isScrolling = false;
        
        const updateParallax = () => {
            const rect = element.getBoundingClientRect();
            const speed = 0.5;
            const yPos = -(rect.top * speed);
            element.style.transform = `translateY(${yPos}px)`;
            isScrolling = false;
        };

        const handleScroll = () => {
            if (!isScrolling) {
                requestAnimationFrame(updateParallax);
                isScrolling = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // === SMOOTH SCROLL ===
    initializeSmoothScroll() {
        if (typeof Lenis !== 'undefined') {
            try {
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smooth: true,
                    smoothTouch: false,
                    touchMultiplier: 2
                });

                const raf = (time) => {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                };
                
                this.rafId = requestAnimationFrame(raf);
                this.lenis = lenis;

                console.log('✅ Smooth scroll initialized');
            } catch (error) {
                console.warn('Smooth scroll initialization failed:', error);
            }
        }
    }

    // === MOUSE GRADIENT EFFECT ===
    initializeMouseGradient() {
        const gradient = document.querySelector('.mouse-gradient-background');
        if (!gradient) return;

        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;

        const updateGradient = () => {
            gradient.style.transform = `translate(${mouseX - 200}px, ${mouseY - 200}px)`;
            isMoving = false;
        };

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMoving) {
                requestAnimationFrame(updateGradient);
                isMoving = true;
            }
        };

        // Only on desktop for performance
        if (window.innerWidth > 768) {
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
        }

        console.log('✅ Mouse gradient initialized');
    }

    // === FLOATING WORDS ===
    initializeFloatingWords() {
        const container = document.getElementById('floating-words-container');
        if (!container || window.innerWidth < 768) return;

        const words = [
            'Hello', 'Bonjour', 'Płynność', 'Fluency', 'Grammar', 'Conversation', 
            'Cześć', 'Apprendre', 'Learn', 'Merci', 'Thanks', 'Język', 'Słowa', 
            'Words', 'Dialogue', 'EN', 'FR', 'PL', 'Parler', 'Speak', 'Écouter', 
            'Listen', 'Culture', 'Sukces', 'Success', 'Accent', 'Pronunciation'
        ];
        
        const wordCount = Math.min(20, Math.floor(window.innerWidth / 80));
        
        for (let i = 0; i < wordCount; i++) {
            const word = document.createElement('span');
            word.className = 'floating-word';
            word.textContent = words[i % words.length];
            
            // Random positioning
            word.style.left = Math.random() * (window.innerWidth - 100) + 'px';
            word.style.top = Math.random() * (window.innerHeight - 50) + 'px';
            word.style.opacity = Math.random() * 0.06 + 0.02;
            word.style.animationDelay = Math.random() * 8 + 's';
            word.style.animationDuration = (Math.random() * 4 + 8) + 's';
            
            container.appendChild(word);
        }
        
        console.log('✅ Floating words initialized');
    }

    // === PERFORMANCE OPTIMIZATIONS ===
    initializePerformanceOptimizations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-normal', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
            
            // Remove floating words animation
            const floatingWords = document.querySelectorAll('.floating-word');
            floatingWords.forEach(word => {
                word.style.animation = 'none';
            });
        }

        // Intersection observer for lazy loading
        this.setupLazyLoading();

        // Preload critical resources
        this.preloadCriticalResources();

        // Setup resize handler with debouncing
        this.setupResizeHandler();

        console.log('✅ Performance optimizations initialized');
    }

    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) return;

        const imageObserver = new IntersectionObserver((entries) => {
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

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        this.observers.set('images', imageObserver);
    }

    preloadCriticalResources() {
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:wght@700&display=swap'
        ];

        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }

    setupResizeHandler() {
        let resizeTimeout;
        
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalculate floating words on resize
                if (window.innerWidth <= 768) {
                    const container = document.getElementById('floating-words-container');
                    if (container) {
                        container.innerHTML = '';
                    }
                } else if (window.innerWidth > 768) {
                    this.initializeFloatingWords();
                }
                
                // Update mouse gradient
                this.initializeMouseGradient();
            }, 250);
        };

        window.addEventListener('resize', handleResize, { passive: true });
    }

    // === UTILITY METHODS ===
    
    // Debounce function for performance
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

    // Throttle function for scroll events
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

    // Clean up method
    destroy() {
        // Cancel animation frame
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }

        // Disconnect observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });

        // Clean up Lenis
        if (this.lenis) {
            this.lenis.destroy();
        }

        // Clear animations map
        this.animations.clear();
        this.observers.clear();

        console.log('✅ App destroyed and cleaned up');
    }
}

// === CSS ANIMATIONS INJECTION ===
const injectAnimations = () => {
    if (document.getElementById('elegant-animations')) return;

    const style = document.createElement('style');
    style.id = 'elegant-animations';
    style.textContent = `
        @keyframes fadeIn {
            from { 
                opacity: 0; 
                transform: translateY(20px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }

        @keyframes fadeInUp {
            from { 
                opacity: 0; 
                transform: translateY(30px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0%, 100% { 
                transform: scale(1); 
            }
            50% { 
                transform: scale(1.05); 
            }
        }

        @keyframes floatGentle {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg); 
                opacity: 0.04; 
            }
            50% { 
                transform: translateY(-20px) rotate(1deg); 
                opacity: 0.12; 
            }
        }

        /* Reveal animation classes */
        .reveal-element {
            opacity: 1 !important;
            visibility: visible !important;
        }

        .revealed {
            animation: fadeIn 0.6s ease-out forwards;
        }

        /* Loading state animations */
        .btn-submit:disabled {
            position: relative;
            overflow: hidden;
        }

        .btn-submit:disabled::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(255, 255, 255, 0.2), 
                transparent
            );
            animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        /* Focus animations */
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            animation: focusPulse 0.3s ease-out;
        }

        @keyframes focusPulse {
            0% { 
                transform: scale(1); 
                box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.4); 
            }
            50% { 
                transform: scale(1.02); 
                box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.2); 
            }
            100% { 
                transform: scale(1); 
                box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1); 
            }
        }

        /* Success animation */
        .form-success-state.visible {
            animation: successSlideIn 0.5s ease-out;
        }

        @keyframes successSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        /* Hover animations for interactive elements */
        .feature-item:hover,
        .pricing-card:hover,
        .testimonial-card:hover {
            animation: hoverLift 0.3s ease-out forwards;
        }

        @keyframes hoverLift {
            to {
                transform: translateY(-5px);
            }
        }
    `;
    
    document.head.appendChild(style);
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    injectAnimations();
});

// Initialize app
const elegantApp = new ElegantApp();

// Make available globally for debugging
window.elegantApp = elegantApp;

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.querySelectorAll('.floating-word').forEach(word => {
            word.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page is visible
        document.querySelectorAll('.floating-word').forEach(word => {
            word.style.animationPlayState = 'running';
        });
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Performance monitoring
if ('performance' in window && 'getEntriesByType' in performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
        }, 0);
    });
}
