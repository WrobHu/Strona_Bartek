// === MAIN APPLICATION CONTROLLER v3.1 - VISIBLE CONTENT ===

class AppController {
    constructor() {
        this.isInitialized = false;
        this.modules = new Map();
        this.config = {
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1200
            },
            animations: {
                duration: {
                    fast: 0.3,
                    normal: 0.6,
                    slow: 1.2
                },
                easing: 'power3.out'
            }
        };
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        console.log('🚀 Initializing application...');
        this.checkDependencies();
        this.initializeCore();
        this.initializeModules();
        this.setupGlobalEvents();
        this.isInitialized = true;
        console.log('✅ Application initialized successfully');
    }

    checkDependencies() {
        const requiredLibraries = ['gsap'];
        const missingLibraries = [];

        requiredLibraries.forEach(lib => {
            if (typeof window[lib] === 'undefined') {
                missingLibraries.push(lib);
            }
        });

        if (missingLibraries.length > 0) {
            console.warn(`⚠️ Missing libraries: ${missingLibraries.join(', ')} - Some features may not work`);
            return false;
        }

        // Register GSAP plugins if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        return true;
    }

    initializeCore() {
        // Initialize smooth scrolling if available
        if (typeof Lenis !== 'undefined') {
            this.initializeSmoothScroll();
        }

        // Initialize page animations - BUT DON'T HIDE CONTENT
        this.initializePageLoadAnimations();
        
        // Initialize mobile menu - PRIORITY
        this.initializeMobileMenu();
        
        // Make sure all content is visible
        this.ensureContentVisibility();
    }

    ensureContentVisibility() {
        // Force all content to be visible
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            // Remove any potential hiding from animations
            if (element.style.opacity === '0' || element.style.visibility === 'hidden') {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
            }
        });
        
        // Specifically ensure main content areas are visible
        const contentSelectors = [
            'main', '.hero-section', '.page-title-section', '.content-section',
            '.form-section', '.pricing-grid', '.features-grid', '.testimonials-grid',
            '.offer-grid', '.about-me-layout', '.cta-section', '.discounts-section'
        ];
        
        contentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                element.style.display = element.style.display || '';
            });
        });
        
        console.log('✅ Content visibility ensured');
    }

    initializeModules() {
        const moduleConfigs = [
            { selector: '#floating-words-container', init: this.initializeFloatingWords },
            { selector: '#contact-form', init: this.initializeFormInteraction },
            { selector: '#cta-popup', init: this.initializeCallToAction },
            { selector: '.faq-accordion', init: this.initializeFaqAccordion }
        ];

        moduleConfigs.forEach(({ selector, init }) => {
            const element = document.querySelector(selector);
            if (element) {
                try {
                    init.call(this, element);
                } catch (error) {
                    console.error(`Failed to initialize module for ${selector}:`, error);
                }
            }
        });
    }

    setupGlobalEvents() {
        // Performance-optimized scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 16); // ~60fps
        }, { passive: true });

        // Responsive handler
        this.setupResponsiveHandler();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();

        // Simple scroll reveal without hiding content initially
        this.setupScrollReveal();
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        const header = document.querySelector('.main-header');
        
        if (header) {
            header.classList.toggle('scrolled', scrollY > 50);
        }
    }

    setupResponsiveHandler() {
        const handleResize = () => {
            const width = window.innerWidth;
            document.body.classList.remove('mobile-view', 'tablet-view', 'desktop-view');
            
            if (width <= this.config.breakpoints.mobile) {
                document.body.classList.add('mobile-view');
            } else if (width <= this.config.breakpoints.tablet) {
                document.body.classList.add('tablet-view');
            } else {
                document.body.classList.add('desktop-view');
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupScrollReveal() {
        // Simple fade-in effect without hiding content initially
        const revealElements = document.querySelectorAll('.reveal-element, .animated-headline');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        // Add a gentle fade-in class without hiding the content
                        entry.target.style.animation = 'fadeIn 0.6s ease-out';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            revealElements.forEach(element => {
                // Don't hide the elements, just observe them
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                observer.observe(element);
            });
        } else {
            // Fallback for older browsers - just make everything visible
            revealElements.forEach(element => {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                element.classList.add('animate');
            });
        }
    }

    closeAllModals() {
        // Close mobile menu
        const hamburger = document.getElementById('hamburger-btn');
        const nav = document.getElementById('main-nav');
        const header = document.querySelector('.main-header');
        
        if (hamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('mobile-active');
            header.classList.remove('nav-open');
            document.body.classList.remove('nav-open');
        }
    }

    // === SMOOTH SCROLL MODULE ===
    initializeSmoothScroll() {
        try {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            console.log('✅ Smooth scroll initialized');
        } catch (error) {
            console.warn('Smooth scroll initialization failed:', error);
        }
    }

    // === PAGE LOAD ANIMATIONS ===
    initializePageLoadAnimations() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not available, using CSS animations');
            return;
        }

        // GENTLE animations that don't hide content
        gsap.utils.toArray('.animated-headline').forEach((headline, index) => {
            // Don't hide content, just add gentle animation
            headline.style.opacity = '1';
            headline.style.visibility = 'visible';
            
            gsap.from(headline, {
                y: 20,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.2 + (index * 0.1)
            });
        });
        
        // Gentle reveal elements on scroll
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.utils.toArray('.reveal-element').forEach(element => {
                // Ensure element is visible first
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                
                gsap.from(element, {
                    y: 20,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                });
            });
        }

        // Parallax effects
        if (typeof ScrollTrigger !== 'undefined') {
            const parallaxElements = document.querySelectorAll('.image-parallax');
            parallaxElements.forEach(element => {
                gsap.to(element, {
                    yPercent: -15,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: element.closest('.about-me-image-wrapper') || element,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            });
        }
    }

    // === MOBILE MENU MODULE - FIXED ===
    initializeMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mainNav = document.getElementById('main-nav');
        const header = document.querySelector('.main-header');

        if (!hamburgerBtn || !mainNav) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Ensure hamburger lines exist
        if (!hamburgerBtn.querySelector('.hamburger-line')) {
            hamburgerBtn.innerHTML = `
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            `;
        }

        hamburgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = hamburgerBtn.classList.toggle('active');
            mainNav.classList.toggle('mobile-active', isActive);
            
            if (header) {
                header.classList.toggle('nav-open', isActive);
            }
            
            document.body.classList.toggle('nav-open', isActive);

            console.log('Menu toggled:', isActive ? 'open' : 'closed');
        });

        // Close menu when clicking nav links
        mainNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                hamburgerBtn.classList.remove('active');
                mainNav.classList.remove('mobile-active');
                if (header) {
                    header.classList.remove('nav-open');
                }
                document.body.classList.remove('nav-open');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (hamburgerBtn.classList.contains('active') && 
                !mainNav.contains(e.target) && 
                !hamburgerBtn.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                mainNav.classList.remove('mobile-active');
                if (header) {
                    header.classList.remove('nav-open');
                }
                document.body.classList.remove('nav-open');
            }
        });

        console.log('✅ Mobile menu initialized');
    }

    // === FLOATING WORDS MODULE ===
    initializeFloatingWords(container) {
        if (window.innerWidth < this.config.breakpoints.mobile) return;

        const words = [
            'Hello', 'Bonjour', 'Płynność', 'Fluency', 'Grammar', 'Conversation', 'Cześć', 
            'Apprendre', 'Learn', 'Merci', 'Thanks', 'Język', 'Słowa', 'Words', 'Dialogue',
            'EN', 'FR', 'PL', 'Parler', 'Speak', 'Écouter', 'Listen', 'Culture', 'Sukces',
            'Oui', 'Yes', 'Non', 'No', 'Savoir', 'To know', 'Español', 'Hola', 'DE', 'Guten Tag'
        ];
        
        const wordCount = Math.min(30, Math.floor(window.innerWidth / 40));
        
        for (let i = 0; i < wordCount; i++) {
            const word = document.createElement('span');
            word.className = 'floating-word';
            word.textContent = words[i % words.length];
            container.appendChild(word);

            // Position randomly
            word.style.left = Math.random() * (window.innerWidth - 100) + 'px';
            word.style.top = Math.random() * (window.innerHeight - 50) + 'px';
            word.style.opacity = Math.random() * 0.1 + 0.05;
            
            // Animate if GSAP is available
            if (typeof gsap !== 'undefined') {
                gsap.set(word, {
                    x: Math.random() * (window.innerWidth - 100),
                    y: Math.random() * (window.innerHeight - 50),
                    scale: 0.5 + Math.random() * 0.5,
                    autoAlpha: 0.05 + Math.random() * 0.1
                });

                const animateWord = (element) => {
                    gsap.to(element, {
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        duration: 30 + Math.random() * 20,
                        autoAlpha: 0.01 + Math.random() * 0.05,
                        scale: 0.7 + Math.random() * 0.5,
                        ease: 'none',
                        onComplete: () => animateWord(element)
                    });
                };

                gsap.to(word, { 
                    autoAlpha: 0.05 + Math.random() * 0.1, 
                    delay: Math.random() * 5, 
                    duration: 2 
                });
                
                animateWord(word);
            }
        }
        
        console.log('✅ Floating words initialized');
    }

    // === CALL TO ACTION MODULE ===
    initializeCallToAction(popup) {
        const openBtn = document.getElementById('cta-open-btn');
        const closeBtn = document.getElementById('cta-close-btn');
        const modal = popup.querySelector('.cta-modal');

        if (!openBtn || !closeBtn || !modal) return;

        let isOpen = false;

        // Make sure popup button is visible
        openBtn.style.opacity = '1';
        openBtn.style.visibility = 'visible';
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        modal.style.display = 'none';

        const openModal = () => {
            if (isOpen) return;
            isOpen = true;
            
            if (typeof gsap !== 'undefined') {
                gsap.set(modal, { display: 'block' });
                gsap.to(openBtn, { scale: 0, autoAlpha: 0, duration: 0.3 });
                gsap.to(modal, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' });
            } else {
                openBtn.style.display = 'none';
                modal.style.display = 'block';
                modal.style.opacity = '1';
                modal.style.transform = 'scale(1)';
            }
        };

        const closeModal = () => {
            if (!isOpen) return;
            isOpen = false;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(modal, { autoAlpha: 0, scale: 0.8, duration: 0.3 });
                gsap.to(openBtn, { scale: 1, autoAlpha: 1, duration: 0.3, delay: 0.1 });
            } else {
                modal.style.opacity = '0';
                modal.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    modal.style.display = 'none';
                    openBtn.style.display = 'flex';
                }, 300);
            }
        };

        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);

        // Close on outside click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closeModal();
            }
        });

        console.log('✅ CTA popup initialized');
    }

    // === FAQ ACCORDION MODULE ===
    initializeFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (!question || !answer) return;

            // Set initial state
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.paddingTop = '0';
                        otherAnswer.style.paddingBottom = '0';
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                
                if (!isActive) {
                    // Open
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.paddingTop = '0.5rem';
                    answer.style.paddingBottom = '1.5rem';
                } else {
                    // Close
                    answer.style.maxHeight = '0';
                    answer.style.paddingTop = '0';
                    answer.style.paddingBottom = '0';
                }
            });
        });

        console.log('✅ FAQ accordion initialized');
    }

    // === FORM INTERACTION MODULE ===
    initializeFormInteraction(form) {
        const formHandler = new FormHandler(form, this.config);
        formHandler.init();
    }
}

// === FORM HANDLER CLASS ===
class FormHandler {
    constructor(form, config) {
        this.form = form;
        this.config = config;
        this.isSubmitting = false;
        this.validationRules = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^\d{9}$/
        };
        this.sliderLevels = [
            "0 - Brak znajomości", "A1 - Początkujący", "A1/A2", "A2 - Podstawowy", "A2/B1", 
            "B1 - Średnio-zaawansowany", "B1/B2", "B2 - Wyższy średnio-zaawansowany",
            "B2/C1", "C1 - Zaawansowany", "C2 - Poziom biegły"
        ];
    }

    init() {
        // Make sure form is visible
        this.form.style.opacity = '1';
        this.form.style.visibility = 'visible';
        
        this.setupElements();
        this.setupSlider();
        this.setupGoalSelection();
        this.setupValidation();
        this.setupSubmission();
        console.log('✅ Form handler initialized');
    }

    setupElements() {
        this.elements = {
            allRequiredInputs: this.form.querySelectorAll('input[required]'),
            submitButton: this.form.querySelector('.btn-submit'),
            successState: document.getElementById('form-success-state'),
            mainError: document.getElementById('form-main-error'),
            sliderContainer: this.form.querySelector('.slider-container'),
            sliderValueDisplay: document.getElementById('slider-value'),
            sliderLegendDisplay: document.getElementById('slider-legend'),
            sliderProgress: document.getElementById('custom-slider-progress'),
            sliderThumb: document.getElementById('custom-slider-thumb'),
            decrementBtn: document.getElementById('slider-decrement'),
            incrementBtn: document.getElementById('slider-increment'),
            goalRadios: this.form.querySelectorAll('input[name="goal"]'),
            otherGoalWrapper: document.getElementById('other-goal-wrapper'),
            otherGoalInput: document.getElementById('other-goal-text'),
            phoneInput: document.getElementById('phone')
        };

        // Create hidden slider input if it doesn't exist
        if (!document.getElementById('level-slider')) {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.id = 'level-slider';
            hiddenInput.name = 'level';
            hiddenInput.value = '5';
            hiddenInput.required = true;
            this.form.appendChild(hiddenInput);
        }
        this.elements.slider = document.getElementById('level-slider');

        // Ensure all elements are visible
        Object.values(this.elements).forEach(element => {
            if (element && element.style) {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
            }
        });
    }

    setupSlider() {
        const { 
            sliderContainer, 
            sliderValueDisplay, 
            sliderLegendDisplay, 
            sliderProgress, 
            sliderThumb,
            decrementBtn, 
            incrementBtn, 
            slider 
        } = this.elements;
        
        if (!sliderContainer) return;

        // Make sure slider container is visible
        sliderContainer.style.opacity = '1';
        sliderContainer.style.visibility = 'visible';

        let currentValue = 5; // Default value

        const updateSliderDisplay = () => {
            const percent = (currentValue / 10) * 100;
            
            if (sliderValueDisplay) {
                sliderValueDisplay.textContent = currentValue;
                sliderValueDisplay.style.opacity = '1';
                sliderValueDisplay.style.visibility = 'visible';
            }
            if (sliderLegendDisplay) {
                sliderLegendDisplay.textContent = this.sliderLevels[currentValue];
                sliderLegendDisplay.style.opacity = '1';
                sliderLegendDisplay.style.visibility = 'visible';
            }
            if (slider) slider.value = currentValue;
            
            // Update progress bar
            if (sliderProgress) {
                sliderProgress.style.width = `${percent}%`;
            }
            
            // Update thumb position
            if (sliderThumb) {
                sliderThumb.style.left = `${percent}%`;
            }

            // Update color based on level
            let colorVar;
            if (currentValue <= 3) colorVar = 'var(--color-error)';
            else if (currentValue <= 7) colorVar = 'var(--color-warn)';
            else colorVar = 'var(--color-success)';
            
            if (sliderContainer) {
                sliderContainer.style.setProperty('--current-slider-color', colorVar);
                if (sliderProgress) sliderProgress.style.backgroundColor = colorVar;
                if (sliderThumb) sliderThumb.style.borderColor = colorVar;
                if (sliderValueDisplay) sliderValueDisplay.style.color = colorVar;
            }
            
            this.validateField(slider || sliderContainer, false);
        };

        // Decrement button
        if (decrementBtn) {
            decrementBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentValue > 0) {
                    currentValue--;
                    updateSliderDisplay();
                }
            });
        }

        // Increment button
        if (incrementBtn) {
            incrementBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentValue < 10) {
                    currentValue++;
                    updateSliderDisplay();
                }
            });
        }

        // Click on slider track
        const sliderTrack = document.getElementById('custom-slider-track');
        if (sliderTrack) {
            sliderTrack.addEventListener('click', (e) => {
                const rect = sliderTrack.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                currentValue = Math.round((percent / 100) * 10);
                updateSliderDisplay();
            });
        }

        // Touch/drag support for thumb
        if (sliderThumb && sliderTrack) {
            let isDragging = false;
            
            const handleMove = (clientX) => {
                if (!isDragging) return;
                
                const rect = sliderTrack.getBoundingClientRect();
                const moveX = clientX - rect.left;
                const percent = Math.max(0, Math.min(100, (moveX / rect.width) * 100));
                currentValue = Math.round((percent / 100) * 10);
                updateSliderDisplay();
            };

            sliderThumb.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                handleMove(e.clientX);
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            // Touch events
            sliderThumb.addEventListener('touchstart', (e) => {
                isDragging = true;
                e.preventDefault();
            });

            document.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    handleMove(e.touches[0].clientX);
                }
            });

            document.addEventListener('touchend', () => {
                isDragging = false;
            });
        }

        // Initial update
        updateSliderDisplay();
    }

    setupGoalSelection() {
        const { goalRadios, otherGoalWrapper, otherGoalInput } = this.elements;
        
        goalRadios.forEach(radio => {
            // Make sure radio cards are visible
            const radioCard = radio.closest('.radio-card');
            if (radioCard) {
                radioCard.style.opacity = '1';
                radioCard.style.visibility = 'visible';
            }

            radio.addEventListener('change', () => {
                // Remove selected class from all cards
                goalRadios.forEach(r => r.closest('.radio-card').classList.remove('selected'));
                
                // Add selected class to current card
                if (radio.checked) {
                    const selectedCard = radio.closest('.radio-card');
                    selectedCard.classList.add('selected');
                }
                
                // Handle "other" option
                const otherIsSelected = radio.value === 'inny' && radio.checked;
                if (otherGoalWrapper) {
                    otherGoalWrapper.classList.toggle('visible', otherIsSelected);
                }
                
                if (otherGoalInput) {
                    otherGoalInput.required = otherIsSelected;
                    if (!otherIsSelected) {
                        otherGoalInput.value = '';
                        this.validateField(otherGoalInput, false);
                    }
                }
                
                this.validateField(radio, false);
            });
        });
    }

    setupValidation() {
        const { phoneInput } = this.elements;
        
        // Phone formatting
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let input = e.target.value.replace(/\D/g, '').substring(0, 9);
                e.target.value = input.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
                this.validateField(e.target, false);
            });
        }

        // Real-time validation for text inputs
        const textInputs = this.form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
        textInputs.forEach(field => {
            field.addEventListener('input', () => {
                this.validateField(field, false);
            });
            
            field.addEventListener('blur', () => {
                this.validateField(field, true);
            });
        });
    }

    setupSubmission() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        const { allRequiredInputs, submitButton, mainError, successState } = this.elements;
        
        let isFormValid = true;
        
        // Validate all required fields
        allRequiredInputs.forEach(field => {
            if (!this.validateField(field, true)) {
                isFormValid = false;
            }
        });

        // Special validation for goals
        const checkedGoal = this.form.querySelector('input[name="goal"]:checked');
        if (!checkedGoal) {
            isFormValid = false;
            if (mainError) {
                mainError.textContent = "Proszę wybrać cel nauki.";
                mainError.classList.add('visible');
            }
        }

        if (!isFormValid) {
            if (mainError && !mainError.classList.contains('visible')) {
                mainError.textContent = "Proszę uzupełnić wszystkie wymagane pola oznaczone gwiazdką.";
                mainError.classList.add('visible');
            }
            return;
        }

        // Hide error message
        if (mainError) {
            mainError.classList.remove('visible');
        }

        this.isSubmitting = true;
        
        // Update submit button
        if (submitButton) {
            submitButton.disabled = true;
            const buttonText = submitButton.querySelector('.btn-text') || submitButton;
            const originalText = buttonText.textContent;
            buttonText.textContent = 'Wysyłanie...';
        }

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success state
            await this.showSuccessState();
            
        } catch (error) {
            console.error('Form submission failed:', error);
            this.showError('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
        } finally {
            this.isSubmitting = false;
        }
    }

    async showSuccessState() {
        const { successState } = this.elements;
        
        if (!successState) return;

        // Hide form
        this.form.style.opacity = '0';
        this.form.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            this.form.style.display = 'none';
            successState.style.visibility = 'visible';
            successState.style.opacity = '1';
        }, 500);
    }

    showError(message) {
        const { mainError } = this.elements;
        
        if (mainError) {
            mainError.textContent = message;
            mainError.classList.add('visible');
        }
    }

    validateField(field, showError = false) {
        if (!field) return true;
        
        const formGroup = field.closest('.form-group') || field.closest('fieldset');
        const errorSpan = formGroup?.querySelector('.error-message');
        let isValid = true;
        let message = '';
        
        const value = field.value ? field.value.trim() : '';
        const fieldToStyle = field.type === 'hidden' || field.name === 'level' ? this.elements.sliderContainer : field;

        // Validation logic
        if (field.required || field.name === 'level') {
            if (field.name === 'goal') {
                const checkedGoal = this.form.querySelector('input[name="goal"]:checked');
                if (!checkedGoal) {
                    isValid = false;
                    if (showError) message = 'Proszę wybrać cel nauki.';
                }
            } else if (field.type === 'hidden' && field.name === 'level') {
                isValid = true; // Slider always has value
            } else if (value === '') {
                isValid = false;
                if (showError) message = 'To pole jest wymagane.';
            } else if (field.type === 'email' && !this.validationRules.email.test(value)) {
                isValid = false;
                if (showError) message = 'Proszę podać poprawny adres e-mail.';
            } else if (field.type === 'tel') {
                const phoneNumber = value.replace(/\s/g, '');
                if (!this.validationRules.phone.test(phoneNumber)) {
                    isValid = false;
                    if (showError) message = 'Numer telefonu musi mieć dokładnie 9 cyfr.';
                }
            } else if (field.id === 'other-goal-text' && value === '') {
                isValid = false;
                if (showError) message = 'Proszę opisać swój cel nauki.';
            }
        }
        
        // Update visual state
        if (fieldToStyle) {
            fieldToStyle.classList.remove('valid', 'error');
            
            if (isValid && (field.required || field.name === 'level')) {
                if ((field.type !== 'radio' && value !== '') || 
                    field.type === 'hidden' || 
                    field.name === 'level' ||
                    (field.type === 'radio' && this.form.querySelector('input[name="goal"]:checked'))) {
                    fieldToStyle.classList.add('valid');
                }
            } else if (message && showError) {
                fieldToStyle.classList.add('error');
            }
        }

        // Handle error message
        if (errorSpan && message && showError) {
            errorSpan.textContent = message;
            errorSpan.classList.add('visible');
        } else if (errorSpan && (!message || !showError)) {
            errorSpan.classList.remove('visible');
        }
        
        return isValid;
    }
}

// === UTILITY FUNCTIONS ===
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// === INITIALIZE APPLICATION ===
const app = new AppController();

// Export for debugging
window.AppController = AppController;
window.app = app;
