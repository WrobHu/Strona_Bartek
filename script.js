// === NAPRAWIONA APLIKACJA - BARTŁOMIEJ PŁÓCIENNIK ===

class ModernApp {
    constructor() {
        this.isInitialized = false;
        this.observers = new Map();
        this.formState = {
            isSubmitting: false,
            validationEnabled: false
        };
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize(), { once: true });
        } else {
            this.initialize();
        }
    }

    // === INICJALIZACJA Z DEBUGOWANIEM ===
    initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing app...');
        
        try {
            this.initializeHeader();
            this.initializeMobileMenu();
            this.initializeForm();
            this.initializeCTAPopup();
            this.initializeScrollEffects();
            this.initializeSmoothScroll();
            this.initializeMouseGradient();
            this.initializeFloatingWords();
            this.preventZoom();
            
            this.isInitialized = true;
            console.log('✅ App initialized successfully');
        } catch (error) {
            console.error('❌ App initialization failed:', error);
        }
    }

    // === BLOKADA ZOOMOWANIA ===
    preventZoom() {
        // Blokada pinch-to-zoom
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('gestureend', (e) => {
            e.preventDefault();
        }, { passive: false });

        // Blokada double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // Blokada wheel zoom
        document.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        }, { passive: false });

        // Blokada keyboard zoom
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
                e.preventDefault();
            }
        });

        console.log('🔒 Zoom prevention initialized');
    }

    // === HEADER SCROLL ===
    initializeHeader() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let isScrolled = false;

        const updateHeader = () => {
            const scrolledNow = window.pageYOffset > 50;
            if (scrolledNow !== isScrolled) {
                isScrolled = scrolledNow;
                header.classList.toggle('scrolled', isScrolled);
            }
        };

        window.addEventListener('scroll', updateHeader, { passive: true });
        console.log('✅ Header initialized');
    }

    // === MOBILE MENU - NAPRAWIONE ===
    initializeMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mainNav = document.getElementById('main-nav');
        const header = document.querySelector('.main-header');

        if (!hamburgerBtn || !mainNav) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Upewnij się, że hamburger ma odpowiednią strukturę
        if (!hamburgerBtn.querySelector('.hamburger-line')) {
            hamburgerBtn.innerHTML = `
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            `;
        }

        let isOpen = false;

        const toggleMenu = () => {
            isOpen = !isOpen;
            
            hamburgerBtn.classList.toggle('active', isOpen);
            mainNav.classList.toggle('mobile-active', isOpen);
            if (header) header.classList.toggle('nav-open', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
            
            hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
        };

        const closeMenu = () => {
            if (isOpen) {
                isOpen = false;
                hamburgerBtn.classList.remove('active');
                mainNav.classList.remove('mobile-active');
                if (header) header.classList.remove('nav-open');
                document.body.classList.remove('nav-open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        };

        hamburgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        mainNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                closeMenu();
            }
        });

        document.addEventListener('click', (e) => {
            if (isOpen && !mainNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isOpen) {
                closeMenu();
            }
        }, { passive: true });

        console.log('✅ Mobile menu initialized');
    }

    // === FORMULARZ - NAPRAWIONY ===
    initializeForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        console.log('✅ Initializing form...');

        const elements = {
            form,
            submitButton: form.querySelector('.btn-submit'),
            successState: document.getElementById('form-success-state'),
            mainError: document.getElementById('form-main-error'),
            phoneInput: document.getElementById('phone'),
            messageInput: document.getElementById('message'),
            formContainer: document.querySelector('.form-container')
        };

        // Phone formatting
        if (elements.phoneInput) {
            elements.phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '').substring(0, 9);
                e.target.value = value.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
            });
        }

        // Real-time validation
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.formState.validationEnabled = true;
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (this.formState.validationEnabled || input.classList.contains('error')) {
                    this.validateField(input);
                }
            });

            input.addEventListener('focus', () => {
                this.clearFieldError(input);
            });
        });

        // Obsługa textarea message - walidacja dopiero gdy ma treść
        if (elements.messageInput) {
            elements.messageInput.addEventListener('input', () => {
                if (elements.messageInput.value.trim().length > 0) {
                    elements.messageInput.classList.add('valid');
                    elements.messageInput.classList.remove('error');
                } else {
                    elements.messageInput.classList.remove('valid', 'error');
                }
            });
        }

        // Enhanced form UX improvements
        const addUXEnhancements = () => {
            // Smooth focus transitions
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    input.parentElement.classList.remove('focused');
                });
            });

            // Real-time character count for textarea
            if (elements.messageInput) {
                const charCountDisplay = document.createElement('div');
                charCountDisplay.className = 'char-count';
                charCountDisplay.style.cssText = `
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                    text-align: right;
                    margin-top: 0.5rem;
                `;
                elements.messageInput.parentElement.appendChild(charCountDisplay);
                
                elements.messageInput.addEventListener('input', () => {
                    const length = elements.messageInput.value.length;
                    charCountDisplay.textContent = `${length} znaków`;
                    
                    if (length > 500) {
                        charCountDisplay.style.color = 'var(--color-warning)';
                    } else {
                        charCountDisplay.style.color = 'var(--color-text-muted)';
                    }
                });
            }

            // Enhanced phone input formatting
            if (elements.phoneInput) {
                elements.phoneInput.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\D/g, '').substring(0, 9);
                    e.target.value = value.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
                    
                    // Visual feedback for valid length
                    if (value.length === 9) {
                        e.target.classList.add('valid');
                        e.target.classList.remove('error');
                    }
                });
            }
        };

        addUXEnhancements();

        // Form submission - na końcu
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!this.formState.isSubmitting) {
                await this.handleFormSubmit(elements);
            }
        });

        console.log('✅ Form initialized');
    }

    validateField(field) {
        const value = field.value.trim();
        const errorSpan = field.closest('.form-group')?.querySelector('.error-message');
        let isValid = true;
        let message = '';

        // Resetuj poprzednie stany
        field.classList.remove('valid', 'error');

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

        // Dodaj klasy CSS
        if (isValid && value) {
            if (field.id === 'message') {
                if (value.length > 0) {
                    field.classList.add('valid');
                }
            } else {
                field.classList.add('valid');
            }
        } else if (!isValid) {
            field.classList.add('error');
        }

        // Obsługa komunikatów błędów
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.toggle('visible', !isValid && message);
        }

        return isValid;
    }

    clearFieldError(field) {
        const errorSpan = field.closest('.form-group')?.querySelector('.error-message');
        if (errorSpan && errorSpan.classList.contains('visible')) {
            errorSpan.classList.remove('visible');
        }
    }

    async handleFormSubmit(elements) {
        const { form, submitButton, successState, mainError, formContainer } = elements;
        
        this.formState.isSubmitting = true;
        this.formState.validationEnabled = true;
        
        // Waliduj wszystkie wymagane pola
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        let firstInvalidField = null;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });

        if (!isValid) {
            this.showMainError(mainError, 'Proszę uzupełnić wszystkie wymagane pola.');
            
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstInvalidField.focus();
            }
            
            this.formState.isSubmitting = false;
            return;
        }

        this.hideMainError(mainError);
        this.setSubmitButtonState(submitButton, true, 'Wysyłanie...');

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.timestamp = new Date().toISOString();
            
            console.log('📤 Sending form data:', data);
            
            // Symulacja wysyłania
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success animation
            this.showFormSuccess(form, successState, formContainer);
            
        } catch (error) {
            console.error('❌ Form submission failed:', error);
            this.showMainError(mainError, 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.');
        } finally {
            this.setSubmitButtonState(submitButton, false, 'Wyślij wiadomość');
            this.formState.isSubmitting = false;
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
        button.classList.toggle('loading', isLoading);
        
        const buttonText = button.querySelector('.btn-text') || button;
        buttonText.textContent = text;
    }

    showFormSuccess(form, successState, formContainer) {
        if (!successState || !formContainer) return;

        // Trigger confetti first
        this.triggerConfetti();

        // Hide form with animation
        form.style.transition = 'all 0.6s ease';
        form.style.opacity = '0';
        form.style.transform = 'translateY(-30px) scale(0.95)';
        
        setTimeout(() => {
            form.style.display = 'none';
            
            // Create success HTML
            successState.innerHTML = `
                <div class="success-checkmark">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
                
                <div class="success-content">
                    <h2>🎉 Dziękuję!</h2>
                    <p class="success-main-text">
                        Twoja wiadomość została wysłana pomyślnie. Cieszę się, że chcesz rozpocząć naukę języka!
                    </p>
                    
                    <div class="success-next-steps">
                        <h3>📋 Co dzieje się dalej?</h3>
                        <ul>
                            <li>✨ Odpowiem Ci w ciągu <strong>24 godzin</strong></li>
                            <li>📞 Umówimy się na <strong>bezpłatną konsultację</strong></li>
                            <li>🎯 Ustalimy Twoje cele i poziom językowy</li>
                            <li>🚀 Rozpoczniemy Twoją przygodę z językiem!</li>
                        </ul>
                    </div>
                    
                    <div class="success-contact-info">
                        <h3>📞 Pilna sprawa?</h3>
                        <p>Możesz też zadzwonić bezpośrednio:</p>
                        <a href="tel:+48661576007" class="contact-phone">+48 661 576 007</a>
                    </div>
                </div>
            `;
            
            successState.style.display = 'flex';
            
            // Show success state
            requestAnimationFrame(() => {
                successState.classList.add('visible');
            });
            
            // SCROLL DO GÓRY PO WYSŁANIU
            setTimeout(() => {
                const formSection = document.querySelector('.form-section');
                if (formSection) {
                    const offsetTop = formSection.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 300);
            
        }, 600);
    }

    triggerConfetti() {
        const confettiColors = ['🎉', '🎊', '✨', '🎈', '🥳'];
        
        for (let i = 0; i < 15; i++) {
            const confetti = document.createElement('div');
            confetti.textContent = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.fontSize = '2rem';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '10000';
            confetti.style.animation = `confettiFall 3s ease-out forwards`;
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3500);
        }
    }

    // === CTA POPUP - NAPRAWIONE DLA MOBILE ===
    initializeCTAPopup() {
        const popup = document.getElementById('cta-popup');
        if (!popup) return;

        const openBtn = document.getElementById('cta-open-btn');
        const closeBtn = document.getElementById('cta-close-btn');
        const modal = popup.querySelector('.cta-modal');

        if (!openBtn || !closeBtn || !modal) {
            console.warn('CTA popup elements not found');
            return;
        }

        let isOpen = false;
        let isAnimating = false;

        // Initial state - NAPRAWIONE
        openBtn.style.display = 'flex';
        openBtn.style.opacity = '1';
        openBtn.style.visibility = 'visible';
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';

        const openModal = () => {
            if (isOpen || isAnimating) return;
            
            console.log('🔄 Opening CTA modal');
            isOpen = true;
            isAnimating = true;
            
            // Hide open button
            openBtn.style.opacity = '0';
            openBtn.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                openBtn.style.display = 'none';
                
                // Show modal
                modal.style.display = 'block';
                modal.style.opacity = '0';
                modal.style.visibility = 'visible';
                modal.style.transform = 'scale(0.8) translateY(10px)';
                
                // Animate in
                requestAnimationFrame(() => {
                    modal.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    modal.style.opacity = '1';
                    modal.style.transform = 'scale(1) translateY(0)';
                    modal.classList.add('visible');
                    
                    setTimeout(() => {
                        isAnimating = false;
                    }, 300);
                });
            }, 150);

            // Haptic feedback on mobile
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        };

        const closeModal = () => {
            if (!isOpen || isAnimating) return;
            
            console.log('🔄 Closing CTA modal');
            isOpen = false;
            isAnimating = true;
            
            // Animate out
            modal.style.transition = 'all 0.25s ease-out';
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.9) translateY(5px)';
            modal.classList.remove('visible');
            
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.visibility = 'hidden';
                
                // Show open button
                openBtn.style.display = 'flex';
                openBtn.style.opacity = '0';
                openBtn.style.transform = 'scale(0.8)';
                
                requestAnimationFrame(() => {
                    openBtn.style.transition = 'all 0.3s ease-out';
                    openBtn.style.opacity = '1';
                    openBtn.style.transform = 'scale(1)';
                    
                    setTimeout(() => {
                        isAnimating = false;
                    }, 300);
                });
            }, 250);
        };

        // Event listeners z improved touch handling
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔘 CTA open button clicked');
            openModal();
        });

        // Touch events for better mobile experience
        openBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            openBtn.style.transform = 'scale(0.95)';
        }, { passive: false });

        openBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            openBtn.style.transform = 'scale(1)';
            openModal();
        }, { passive: false });
        
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('❌ CTA close button clicked');
            closeModal();
        });
        
        // Close on outside click - IMPROVED
        document.addEventListener('click', (e) => {
            if (isOpen && !modal.contains(e.target) && !openBtn.contains(e.target)) {
                console.log('🔄 Closing CTA modal - outside click');
                closeModal();
            }
        });

        // Close on link click
        modal.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                console.log('🔗 Closing CTA modal - link clicked');
                setTimeout(closeModal, 100); // Small delay for better UX
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                console.log('⌨️ Closing CTA modal - escape key');
                closeModal();
            }
        });

        // Close on scroll (mobile UX improvement)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (isOpen && window.innerWidth <= 768) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    console.log('📱 Closing CTA modal - scroll on mobile');
                    closeModal();
                }, 150);
            }
        }, { passive: true });

        console.log('✅ CTA popup initialized');
    }

    // === SCROLL EFFECTS ===
    initializeScrollEffects() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

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

        const revealElements = document.querySelectorAll('.reveal-element, .feature-item, .pricing-card, .testimonial-card');
        revealElements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            revealObserver.observe(element);
        });

        this.observers.set('reveal', revealObserver);
        console.log('✅ Scroll effects initialized');
    }

    // === SMOOTH SCROLL ===
    initializeSmoothScroll() {
        if (typeof Lenis !== 'undefined') {
            try {
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smooth: true
                });

                const raf = (time) => {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                };
                
                requestAnimationFrame(raf);
                console.log('✅ Smooth scroll initialized');
            } catch (error) {
                console.warn('Smooth scroll failed:', error);
            }
        }
    }

    // === MOUSE GRADIENT ===
    initializeMouseGradient() {
        const gradient = document.querySelector('.mouse-gradient-background');
        if (!gradient || window.innerWidth <= 768) return;

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

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        console.log('✅ Mouse gradient initialized');
    }

    // === FLOATING WORDS ===
    initializeFloatingWords() {
        const container = document.getElementById('floating-words-container');
        if (!container || window.innerWidth <= 768) return;

        const words = [
            'Hello', 'Bonjour', 'Płynność', 'Fluency', 'Grammar', 'Conversation', 
            'Cześć', 'Apprendre', 'Learn', 'Merci', 'Thanks', 'Język'
        ];
        
        const wordCount = Math.min(15, Math.floor(window.innerWidth / 100));
        
        for (let i = 0; i < wordCount; i++) {
            const word = document.createElement('span');
            word.className = 'floating-word';
            word.textContent = words[i % words.length];
            word.style.left = Math.random() * (window.innerWidth - 100) + 'px';
            word.style.top = Math.random() * (window.innerHeight - 50) + 'px';
            word.style.opacity = Math.random() * 0.08 + 0.02;
            word.style.animationDelay = Math.random() * 8 + 's';
            
            container.appendChild(word);
        }
        
        console.log('✅ Floating words initialized');
    }

    // === MOBILE OPTIMIZATIONS ===
    initializeMobileOptimizations() {
        if (window.innerWidth <= 768) {
            // Disable hover effects on mobile
            const style = document.createElement('style');
            style.innerHTML = `
                @media (hover: none) and (pointer: coarse) {
                    .feature-item:hover,
                    .pricing-card:hover,
                    .testimonial-card:hover,
                    .offer-category:hover {
                        transform: none !important;
                        box-shadow: var(--shadow-subtle) !important;
                    }
                }
            `;
            document.head.appendChild(style);

            // Optimize scroll performance
            document.addEventListener('touchstart', () => {}, { passive: true });
            document.addEventListener('touchmove', () => {}, { passive: true });
            
            console.log('📱 Mobile optimizations applied');
        }
    }

    // === PERFORMANCE MONITORING ===
    initializePerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    console.log(`⚡ Page load time: ${loadTime}ms`);
                    
                    if (loadTime > 3000) {
                        console.warn('⚠️ Slow page load detected');
                    }
                }, 0);
            });
        }
    }

    // === CLEANUP ===
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        console.log('✅ App cleaned up');
    }
}

// === CSS ANIMATIONS ===
const injectAnimations = () => {
    if (document.getElementById('app-animations')) return;

    const style = document.createElement('style');
    style.id = 'app-animations';
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

        @keyframes confettiFall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }

        .reveal-element {
            opacity: 1 !important;
            visibility: visible !important;
        }

        .revealed {
            animation: fadeIn 0.6s ease-out forwards;
        }

        .loading {
            position: relative;
            overflow: hidden;
        }

        .loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(255, 255, 255, 0.3), 
                transparent
            );
            animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        /* Mobile popup animations */
        @media (max-width: 768px) {
            .cta-modal {
                transform-origin: bottom center !important;
            }
            
            .cta-modal.visible {
                animation: slideUpMobile 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            }
        }

        @keyframes slideUpMobile {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    
    document.head.appendChild(style);
};

// === VIEWPORT META TAG INJECTION ===
const injectViewportMeta = () => {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        document.head.appendChild(viewportMeta);
    }
    
    // NAPRAWIONA BLOKADA ZOOMOWANIA
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
};

// === INITIALIZATION ===
injectViewportMeta();
injectAnimations();

// Initialize app
const app = new ModernApp();
window.app = app;

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                console.log(`⚡ Total load time: ${loadTime}ms`);
            }
        }, 0);
    });
}

console.log('🎯 App loaded successfully');
