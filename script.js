// === MAIN APPLICATION CONTROLLER v2.0 ===

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
        
        document.addEventListener('DOMContentLoaded', () => {
            this.checkDependencies();
            this.initializeCore();
            this.initializeModules();
            this.setupGlobalEvents();
            this.isInitialized = true;
            console.log('🚀 Application initialized successfully');
        });
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
            console.error(`❌ Missing required libraries: ${missingLibraries.join(', ')}`);
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

        // Initialize page animations
        this.initializePageLoadAnimations();
        
        // Initialize mobile menu
        this.initializeMobileMenu();
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
        // Enhanced headline animations
        gsap.utils.toArray('.animated-headline').forEach((headline, index) => {
            gsap.from(headline, {
                autoAlpha: 0,
                filter: 'blur(10px)',
                y: 30,
                duration: 1.5,
                ease: 'expo.out',
                delay: 0.5 + (index * 0.1)
            });
        });
        
        // Reveal elements on scroll
        gsap.utils.toArray('.reveal-element').forEach(element => {
            gsap.from(element, {
                autoAlpha: 0,
                y: 50,
                duration: 1.5,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                }
            });
        });

        // Parallax effects
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

        // Fade in animations for form elements
        gsap.utils.toArray('.fade-in').forEach((element, index) => {
            gsap.from(element, {
                autoAlpha: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out',
                delay: index * 0.1
            });
        });
    }

    // === MOBILE MENU MODULE ===
    initializeMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mainNav = document.getElementById('main-nav');
        const header = document.querySelector('.main-header');

        if (!hamburgerBtn || !mainNav) return;

        // Create hamburger lines if they don't exist
        if (!hamburgerBtn.querySelector('.hamburger-line')) {
            for (let i = 0; i < 3; i++) {
                const line = document.createElement('span');
                line.className = 'hamburger-line';
                hamburgerBtn.appendChild(line);
            }
        }

        hamburgerBtn.addEventListener('click', () => {
            const isActive = hamburgerBtn.classList.toggle('active');
            mainNav.classList.toggle('mobile-active', isActive);
            header.classList.toggle('nav-open', isActive);
            document.body.classList.toggle('nav-open', isActive);

            // Animate hamburger lines
            const lines = hamburgerBtn.querySelectorAll('.hamburger-line');
            if (isActive) {
                gsap.to(lines[0], { rotation: 45, y: 6, duration: 0.3 });
                gsap.to(lines[1], { autoAlpha: 0, duration: 0.3 });
                gsap.to(lines[2], { rotation: -45, y: -6, duration: 0.3 });
            } else {
                gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3 });
                gsap.to(lines[1], { autoAlpha: 1, duration: 0.3 });
                gsap.to(lines[2], { rotation: 0, y: 0, duration: 0.3 });
            }
        });

        // Close menu when clicking nav links
        mainNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                hamburgerBtn.click();
            }
        });
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
        
        const wordCount = Math.min(40, Math.floor(window.innerWidth / 30));
        
        for (let i = 0; i < wordCount; i++) {
            const word = document.createElement('span');
            word.className = 'floating-word';
            word.textContent = words[i % words.length];
            container.appendChild(word);

            gsap.set(word, {
                x: Math.random() * (window.innerWidth - 100),
                y: Math.random() * (window.innerHeight - 50),
                scale: 0.5 + Math.random() * 0.5,
                autoAlpha: 0
            });

            const animateWord = (element) => {
                gsap.to(element, {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    duration: 30 + Math.random() * 20,
                    autoAlpha: 0.01 + Math.random() * 0.03,
                    scale: 0.7 + Math.random() * 0.5,
                    ease: 'none',
                    onComplete: () => animateWord(element)
                });
            };

            gsap.to(word, { 
                autoAlpha: 0.01 + Math.random() * 0.03, 
                delay: Math.random() * 10, 
                duration: 3 
            });
            
            animateWord(word);
        }
    }

    // === CALL TO ACTION MODULE ===
    initializeCallToAction(popup) {
        const openBtn = document.getElementById('cta-open-btn');
        const closeBtn = document.getElementById('cta-close-btn');
        const modal = popup.querySelector('.cta-modal');

        if (!openBtn || !closeBtn || !modal) return;

        gsap.set(modal, { autoAlpha: 0, scale: 0.8 });
        
        const timeline = gsap.timeline({ paused: true });
        
        timeline
            .to(openBtn, { 
                scale: 0, 
                autoAlpha: 0, 
                duration: 0.3, 
                ease: 'back.in(1.7)' 
            })
            .to(modal, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.7)'
            }, "-=0.1")
            .from(modal.querySelectorAll('h3, p, a'), { 
                y: 20, 
                autoAlpha: 0, 
                stagger: 0.1, 
                duration: 0.5 
            }, "-=0.4");

        openBtn.addEventListener('click', () => {
            timeline.play();
        });

        closeBtn.addEventListener('click', () => {
            timeline.reverse();
        });

        // Close on outside click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                timeline.reverse();
            }
        });
    }

    // === FAQ ACCORDION MODULE ===
    initializeFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (!question || !answer) return;

            gsap.set(answer, { 
                height: 0, 
                autoAlpha: 0, 
                paddingTop: 0, 
                paddingBottom: 0 
            });

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        gsap.to(otherAnswer, {
                            height: 0,
                            autoAlpha: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            duration: 0.4,
                            ease: 'power2.inOut'
                        });
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                
                if (!isActive) {
                    // Open
                    gsap.to(answer, {
                        height: 'auto',
                        autoAlpha: 1,
                        paddingTop: '0.5rem',
                        paddingBottom: '1.5rem',
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                } else {
                    // Close
                    gsap.to(answer, {
                        height: 0,
                        autoAlpha: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        duration: 0.4,
                        ease: 'power2.inOut'
                    });
                }
            });
        });
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
    }

    init() {
        this.setupElements();
        this.setupSlider();
        this.setupGoalSelection();
        this.setupValidation();
        this.setupSubmission();
    }

    setupElements() {
        this.elements = {
            allRequiredInputs: this.form.querySelectorAll('input[required]'),
            submitButton: this.form.querySelector('.btn-submit'),
            successState: document.getElementById('form-success-state'),
            mainError: document.getElementById('form-main-error'),
            slider: document.getElementById('level-slider'),
            sliderContainer: this.form.querySelector('.slider-container'),
            sliderValueDisplay: document.getElementById('slider-value'),
            sliderLegendDisplay: document.getElementById('slider-legend'),
            decrementBtn: document.getElementById('slider-decrement'),
            incrementBtn: document.getElementById('slider-increment'),
            goalRadios: this.form.querySelectorAll('input[name="goal"]'),
            otherGoalWrapper: document.getElementById('other-goal-wrapper'),
            otherGoalInput: document.getElementById('other-goal-text'),
            phoneInput: document.getElementById('phone')
        };
    }

    setupSlider() {
        const { slider, sliderValueDisplay, sliderLegendDisplay, sliderContainer, decrementBtn, incrementBtn } = this.elements;
        
        if (!slider) return;

        const sliderLevels = [
            "0 - Brak znajomości", "A1 - Początkujący", "A1/A2", "A2 - Podstawowy", "A2/B1", 
            "B1 - Średnio-zaawansowany", "B1/B2", "B2 - Wyższy średnio-zaawansowany",
            "B2/C1", "C1 - Zaawansowany", "C2 - Poziom biegły"
        ];
        
        const updateSliderDisplay = () => {
            const value = parseInt(slider.value);
            const max = parseInt(slider.max);
            const min = parseInt(slider.min);
            const percent = ((value - min) / (max - min)) * 100;
            
            if (sliderValueDisplay) sliderValueDisplay.textContent = value;
            if (sliderLegendDisplay) sliderLegendDisplay.textContent = sliderLevels[value];
            
            slider.style.setProperty('--slider-progress', `${percent}%`);

            let colorVar;
            if (value <= 3) colorVar = 'var(--color-error)';
            else if (value <= 7) colorVar = 'var(--color-warn)';
            else colorVar = 'var(--color-success)';
            
            if (sliderContainer) {
                gsap.to(sliderContainer, { 
                    '--current-slider-color': colorVar, 
                    duration: 0.4 
                });
            }
            
            this.validateField(slider, false);
        };

        slider.addEventListener('input', updateSliderDisplay);
        
        if (decrementBtn) {
            decrementBtn.addEventListener('click', () => {
                const currentValue = parseInt(slider.value);
                const minValue = parseInt(slider.min);
                if (currentValue > minValue) {
                    slider.value = currentValue - 1;
                    updateSliderDisplay();
                }
            });
        }

        if (incrementBtn) {
            incrementBtn.addEventListener('click', () => {
                const currentValue = parseInt(slider.value);
                const maxValue = parseInt(slider.max);
                if (currentValue < maxValue) {
                    slider.value = currentValue + 1;
                    updateSliderDisplay();
                }
            });
        }

        updateSliderDisplay();
    }

    setupGoalSelection() {
        const { goalRadios, otherGoalWrapper, otherGoalInput } = this.elements;
        
        goalRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                // Remove selected class from all cards
                goalRadios.forEach(r => r.closest('.radio-card').classList.remove('selected'));
                
                // Add selected class to current card
                if (radio.checked) {
                    const selectedCard = radio.closest('.radio-card');
                    selectedCard.classList.add('selected');
                    
                    // Animate selection
                    gsap.from(selectedCard, {
                        scale: 0.98,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
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

        if (!isFormValid) {
            if (mainError) {
                mainError.textContent = "Proszę uzupełnić wszystkie wymagane pola oznaczone gwiazdką.";
                mainError.classList.add('visible');
                gsap.from(mainError, { 
                    y: -10, 
                    autoAlpha: 0, 
                    duration: 0.3 
                });
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
            const buttonText = submitButton.querySelector('.btn-text');
            const originalText = buttonText.textContent;
            buttonText.textContent = 'Wysyłanie...';
            
            // Add loading animation
            gsap.to(submitButton, {
                scale: 0.98,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
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

        const timeline = gsap.timeline();
        
        // Hide form
        await timeline.to(this.form, { 
            autoAlpha: 0, 
            y: -50, 
            duration: 0.5, 
            ease: 'power3.in' 
        });

        // Show success state
        successState.style.visibility = 'visible';
        timeline.set(successState, { autoAlpha: 1 });
        
        // Animate success elements
        const successIcon = successState.querySelector('.success-icon');
        const successTexts = successState.querySelectorAll('h2, p');
        
        if (successIcon) {
            timeline.from(successIcon, { 
                scale: 0, 
                rotation: 180,
                ease: 'back.out(1.7)', 
                duration: 0.6 
            });
        }
        
        if (successTexts.length > 0) {
            timeline.from(successTexts, { 
                y: 30, 
                autoAlpha: 0, 
                stagger: 0.15, 
                duration: 0.5,
                ease: 'power2.out'
            }, "-=0.3");
        }
    }

    showError(message) {
        const { mainError } = this.elements;
        
        if (mainError) {
            mainError.textContent = message;
            mainError.classList.add('visible');
            gsap.from(mainError, { 
                y: -10, 
                autoAlpha: 0, 
                duration: 0.3 
            });
        }
    }

    validateField(field, showError = false) {
        const formGroup = field.closest('.form-group');
        const errorSpan = formGroup?.querySelector('.error-message');
        let isValid = true;
        let message = '';
        
        const value = field.value ? field.value.trim() : '';
        const fieldToStyle = field.type === 'range' ? this.elements.sliderContainer : field;

        // Validation logic
        if (field.required) {
            if (field.name === 'goal') {
                const checkedGoal = this.form.querySelector('input[name="goal"]:checked');
                if (!checkedGoal) {
                    isValid = false;
                    if (showError) message = 'Proszę wybrać cel nauki.';
                }
            } else if (field.type === 'range') {
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
            
            if (isValid && field.required) {
                if ((field.type !== 'radio' && value !== '') || 
                    field.type === 'range' || 
                    (field.type === 'radio' && this.form.querySelector('input[name="goal"]:checked'))) {
                    fieldToStyle.classList.add('valid');
                }
            } else if (message && showError) {
                fieldToStyle.classList.add('error');
            }
        }

        // Handle error message
        if (errorSpan) {
            if (message && showError) {
                errorSpan.textContent = message;
                errorSpan.classList.add('visible');
                gsap.from(errorSpan, { 
                    y: -5, 
                    autoAlpha: 0, 
                    duration: 0.3 
                });
            } else {
                errorSpan.classList.remove('visible');
            }
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
