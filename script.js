// Obsługa slidera poziomów
        const levelSlider = document.getElementById('level');
        const levelDisplay = document.getElementById('level-display');
        
        if (levelSlider && levelDisplay) {
            const updateLevelDisplay = () => {
                const value = levelSlider.value;
                levelDisplay.textContent = value;
                
                // Dodaj kolory w zależności od poziomu
                const container = levelSlider.closest('.level-slider-container');
                container.classList.remove('level-low', 'level-medium', 'level-high');
                
                if (value <= 3) {
                    container.classList.add('level-low');
                } else if (value <= 7) {
                    container.classList.add('level-medium');
                } else {
                    container.classList.add('level-high');
                }
                
                // Trigger validation if enabled
                if (this.formState.validationEnabled) {
                    this.validateField(levelSlider);
                }
            };
            
            levelSlider.addEventListener('input', updateLevelDisplay);
            levelSlider.addEventListener('change', updateLevelDisplay);
            
            // Initialize display
            updateLevelDisplay();
        }// === ULEPSZONA APLIKACJA - BARTŁOMIEJ PŁÓCIENNIK ===

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

    initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing enhanced app...');
        
        try {
            this.initializeHeader();
            this.initializeMobileMenu();
            this.initializeForm();
            this.initializeCTAPopup();
            this.initializeScrollEffects();
            this.initializeSmoothScroll();
            this.initializeMouseGradient();
            this.initializeFloatingWords();
            this.initializeEnhancements();
            
            this.isInitialized = true;
            console.log('✅ Enhanced app initialized successfully');
        } catch (error) {
            console.error('❌ App initialization failed:', error);
        }
    }

    // === HEADER SCROLL ===
    initializeHeader() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let isScrolled = false;
        let ticking = false;

        const updateHeader = () => {
            const scrolledNow = window.pageYOffset > 50;
            if (scrolledNow !== isScrolled) {
                isScrolled = scrolledNow;
                header.classList.toggle('scrolled', isScrolled);
            }
            ticking = false;
        };

        const requestHeaderUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
        console.log('✅ Header scroll initialized');
    }

    // === MOBILE MENU - ULEPSZONE ===
    initializeMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mainNav = document.getElementById('main-nav');
        const header = document.querySelector('.main-header');

        if (!hamburgerBtn || !mainNav) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Obsługa slidera poziomów
        const levelSlider = document.getElementById('level');
        const levelDisplay = document.getElementById('level-display');
        
        if (levelSlider && levelDisplay) {
            const updateLevelDisplay = () => {
                const value = levelSlider.value;
                levelDisplay.textContent = value;
                
                // Dodaj kolory w zależności od poziomu
                const container = levelSlider.closest('.level-slider-container');
                container.classList.remove('level-low', 'level-medium', 'level-high');
                
                if (value <= 3) {
                    container.classList.add('level-low');
                } else if (value <= 7) {
                    container.classList.add('level-medium');
                } else {
                    container.classList.add('level-high');
                }
                
                // Trigger validation if enabled
                if (this.formState.validationEnabled) {
                    this.validateField(levelSlider);
                }
            };
            
            levelSlider.addEventListener('input', updateLevelDisplay);
            levelSlider.addEventListener('change', updateLevelDisplay);
            
            // Initialize display
            updateLevelDisplay();
        } Upewnij się, że hamburger ma odpowiednią strukturę
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
            header?.classList.toggle('nav-open', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
            
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
            
            // Dodaj vibration feedback na urządzeniach mobilnych
            if ('vibrate' in navigator && isOpen) {
                navigator.vibrate(50);
            }
        };

        const closeMenu = () => {
            if (isOpen) {
                isOpen = false;
                hamburgerBtn.classList.remove('active');
                mainNav.classList.remove('mobile-active');
                header?.classList.remove('nav-open');
                document.body.classList.remove('nav-open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        };

        hamburgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
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

        console.log('✅ Enhanced mobile menu initialized');
    }

    // === FORMULARZ - ZNACZNIE ULEPSZONA WALIDACJA ===
    initializeForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        console.log('✅ Initializing enhanced form...');

        const elements = {
            form,
            submitButton: form.querySelector('.btn-submit'),
            successState: document.getElementById('form-success-state'),
            mainError: document.getElementById('form-main-error'),
            phoneInput: document.getElementById('phone'),
            messageInput: document.getElementById('message'),
            formContainer: document.querySelector('.form-container')
        };

        // Phone formatting z lepszą obsługą
        if (elements.phoneInput) {
            elements.phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '').substring(0, 9);
                e.target.value = value.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
            });

            elements.phoneInput.addEventListener('keydown', (e) => {
                // Pozwól na backspace, delete, tab, escape, enter
                if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                    // Pozwól na Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    (e.keyCode === 65 && e.ctrlKey === true) ||
                    (e.keyCode === 67 && e.ctrlKey === true) ||
                    (e.keyCode === 86 && e.ctrlKey === true) ||
                    (e.keyCode === 88 && e.ctrlKey === true)) {
                    return;
                }
                // Upewnij się, że to liczba
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        }

        // Ulepszona walidacja w czasie rzeczywistym
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

            // Dodaj focus effect
            input.addEventListener('focus', () => {
                this.clearFieldError(input);
            });
        });

        // Obsługa textarea message - walidacja dopiero gdy ma treść
        if (elements.messageInput) {
            elements.messageInput.addEventListener('input', () => {
                if (elements.messageInput.value.trim().length > 0) {
                    elements.messageInput.classList.add('valid');
                } else {
                    elements.messageInput.classList.remove('valid');
                }
            });
        }

        // Form submission z lepszą obsługą błędów
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!this.formState.isSubmitting) {
                await this.handleFormSubmit(elements);
            }
        });

        console.log('✅ Enhanced form initialized');
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
        } else if (field.tagName === 'SELECT' && value) {
            // Walidacja select
            if (!value || value === '') {
                isValid = false;
                message = 'Proszę wybrać opcję z listy.';
            }
        }

        // Dodaj klasy CSS
        if (isValid && value) {
            // POPRAWKA: Pole message (opcjonalne) dostaje klasę valid tylko gdy ma treść
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
            
            // Przeskroluj do pierwszego błędnego pola
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
            data.userAgent = navigator.userAgent;
            data.language = navigator.language;
            
            console.log('📤 Sending form data:', data);
            
            // Symulacja wysyłania z realnym opóźnieniem
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Tutaj byłaby prawdziwa integracja z backendem
            // const response = await fetch('/submit-form', {
            //     method: 'POST',
            //     body: formData
            // });
            
            // if (!response.ok) {
            //     throw new Error('Network error');
            // }
            
            // Trigger success animation z konfetti
            this.showFormSuccess(form, successState, formContainer);
            
        } catch (error) {
            console.error('❌ Form submission failed:', error);
            this.showMainError(mainError, 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub skontaktuj się telefonicznie.');
        } finally {
            this.setSubmitButtonState(submitButton, false, 'Wyślij wiadomość');
            this.formState.isSubmitting = false;
        }
    }

    showMainError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
            
            // Vibration feedback na mobile
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
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

        // Success sound if available
        this.playSuccessSound();

        // Hide form with smooth animation
        form.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        form.style.opacity = '0';
        form.style.transform = 'translateY(-20px) scale(0.95)';
        
        setTimeout(() => {
            form.style.display = 'none';
            
            // Prepare success state
            successState.innerHTML = this.createSuccessHTML();
            successState.style.display = 'flex';
            
            // Show success state with staggered animations
            requestAnimationFrame(() => {
                successState.classList.add('visible');
                this.animateSuccessElements();
            });
            
            // Scroll to success message
            setTimeout(() => {
                successState.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 500);
            
        }, 800);
    }

    createSuccessHTML() {
        return `
            <div class="success-animation">
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
                        
                        <div class="availability">
                            <strong>Dostępność:</strong><br>
                            Pon-Pt: 9:00-20:00<br>
                            Sob: 10:00-16:00
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    animateSuccessElements() {
        // Dodaj klasy animacji z opóźnieniami
        const elements = document.querySelectorAll('.success-content > *');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animation = `fadeInUp 0.6s ease-out forwards`;
            }, index * 200);
        });
    }

    triggerConfetti() {
        const confettiColors = ['🎉', '🎊', '✨', '🎈', '🥳', '🌟', '💫', '🎆'];
        const confettiCount = window.innerWidth > 768 ? 20 : 12;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.textContent = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -10px;
                fontSize: ${Math.random() * 1 + 1.5}rem;
                pointerEvents: none;
                zIndex: 10000;
                animation: confettiFall ${Math.random() * 2 + 3}s ease-out forwards;
                animationDelay: ${Math.random() * 0.5}s;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    }

    playSuccessSound() {
        try {
            // Utwórz prosty dźwięk sukcesu
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const playTone = (frequency, duration, delay = 0) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + duration);
                }, delay);
            };
            
            // Zagraj melodię sukcesu
            playTone(523.25, 0.2, 0);    // C5
            playTone(659.25, 0.2, 200);  // E5
            playTone(783.99, 0.4, 400);  // G5
            
        } catch (error) {
            console.log('Audio not available:', error);
        }
    }

    // === CTA POPUP - ULEPSZONE ===
    initializeCTAPopup() {
        const popup = document.getElementById('cta-popup');
        if (!popup) return;

        const openBtn = document.getElementById('cta-open-btn');
        const closeBtn = document.getElementById('cta-close-btn');
        const modal = popup.querySelector('.cta-modal');

        if (!openBtn || !closeBtn || !modal) return;

        let isOpen = false;
        let hideTimeout = null;

        // Ensure initial state
        openBtn.style.display = 'flex';
        modal.style.display = 'none';

        const openModal = () => {
            if (isOpen) return;
            isOpen = true;
            
            // Clear any hide timeout
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            
            openBtn.style.display = 'none';
            modal.style.display = 'block';
            
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.style.transform = 'scale(1)';
                modal.classList.add('visible');
            }, 10);

            // Vibration feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
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
            }, 300);
        };

        const autoHideModal = () => {
            hideTimeout = setTimeout(() => {
                if (isOpen) {
                    closeModal();
                }
            }, 10000); // Auto hide after 10 seconds
        };

        openBtn.addEventListener('click', () => {
            openModal();
            autoHideModal();
        });
        
        closeBtn.addEventListener('click', closeModal);
        
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closeModal();
            }
        });

        // Close on links click
        modal.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeModal();
            }
        });

        // Show/hide based on scroll behavior
        let lastScrollY = window.pageYOffset;
        let scrollTimeout = null;

        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;
            const isScrollingDown = currentScrollY > lastScrollY;
            const isNearBottom = (window.innerHeight + currentScrollY) >= (document.body.offsetHeight - 1000);
            
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Hide button when scrolling down, show when scrolling up or near bottom
            if (isScrollingDown && !isNearBottom && currentScrollY > 200) {
                openBtn.style.transform = 'scale(0.8)';
                openBtn.style.opacity = '0.7';
            } else {
                openBtn.style.transform = 'scale(1)';
                openBtn.style.opacity = '1';
            }

            // Show more prominently when user stops scrolling
            scrollTimeout = setTimeout(() => {
                openBtn.style.transform = 'scale(1)';
                openBtn.style.opacity = '1';
            }, 150);

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        console.log('✅ Enhanced CTA popup initialized');
    }

    // === SCROLL EFFECTS - ULEPSZONE ===
    initializeScrollEffects() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        // Main reveal observer
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.dataset.delay || 0;
                    
                    setTimeout(() => {
                        element.style.animation = 'fadeIn 0.8s ease-out forwards';
                        element.classList.add('revealed');
                    }, delay);
                    
                    revealObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Performance optimized reveal elements
        const revealElements = document.querySelectorAll('.reveal-element, .feature-item, .pricing-card, .testimonial-card');
        revealElements.forEach((element, index) => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            
            // Add staggered delays for grid elements
            if (element.classList.contains('feature-item') || 
                element.classList.contains('pricing-card') || 
                element.classList.contains('testimonial-card')) {
                element.dataset.delay = (index % 3) * 100;
            }
            
            revealObserver.observe(element);
        });

        // Progress indicator
        this.initializeScrollProgress();

        this.observers.set('reveal', revealObserver);
        console.log('✅ Enhanced scroll effects initialized');
    }

    initializeScrollProgress() {
        let progressBar = document.querySelector('.scroll-progress');
        
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
                z-index: 1001;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        }

        let ticking = false;

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
            ticking = false;
        };

        const requestProgressUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestProgressUpdate, { passive: true });
    }

    // === SMOOTH SCROLL - ULEPSZONE ===
    initializeSmoothScroll() {
        if (typeof Lenis !== 'undefined') {
            try {
                const lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smooth: true,
                    direction: 'vertical',
                    gestureDirection: 'vertical',
                    smoothTouch: false,
                    touchMultiplier: 2
                });

                const raf = (time) => {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                };
                
                requestAnimationFrame(raf);

                // Integration with GSAP ScrollTrigger if available
                if (typeof ScrollTrigger !== 'undefined') {
                    lenis.on('scroll', ScrollTrigger.update);
                }

                // Store lenis instance
                this.lenis = lenis;
                
                console.log('✅ Enhanced smooth scroll initialized');
            } catch (error) {
                console.warn('Smooth scroll failed:', error);
            }
        }
    }

    // === MOUSE GRADIENT - ULEPSZONE ===
    initializeMouseGradient() {
        const gradient = document.querySelector('.mouse-gradient-background');
        if (!gradient || window.innerWidth <= 768) return;

        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;
        let animationId = null;

        const updateGradient = () => {
            gradient.style.transform = `translate(${mouseX - 200}px, ${mouseY - 200}px)`;
            isMoving = false;
            animationId = null;
        };

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMoving && !animationId) {
                animationId = requestAnimationFrame(updateGradient);
                isMoving = true;
            }
        };

        // Throttle mouse events for better performance
        let throttleTimeout = null;
        const throttledMouseMove = (e) => {
            if (!throttleTimeout) {
                throttleTimeout = setTimeout(() => {
                    handleMouseMove(e);
                    throttleTimeout = null;
                }, 16); // ~60fps
            }
        };

        document.addEventListener('mousemove', throttledMouseMove, { passive: true });
        
        // Hide gradient when mouse leaves window
        document.addEventListener('mouseleave', () => {
            gradient.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            gradient.style.opacity = '1';
        });

        console.log('✅ Enhanced mouse gradient initialized');
    }

    // === FLOATING WORDS - ULEPSZONE ===
    initializeFloatingWords() {
        const container = document.getElementById('floating-words-container');
        if (!container || window.innerWidth <= 768) return;

        const words = [
            'Hello', 'Bonjour', 'Płynność', 'Fluency', 'Grammar', 'Conversation', 
            'Cześć', 'Apprendre', 'Learn', 'Merci', 'Thanks', 'Język',
            'Practice', 'Pratique', 'Nauka', 'Speaking', 'Parler', 'Mówienie',
            'English', 'Français', 'Angielski', 'Francuski'
        ];
        
        const wordCount = Math.min(20, Math.floor(window.innerWidth / 80));
        
        // Clear existing words
        container.innerHTML = '';
        
        for (let i = 0; i < wordCount; i++) {
            const word = document.createElement('span');
            word.className = 'floating-word';
            word.textContent = words[i % words.length];
            
            // Random positioning
            word.style.cssText = `
                left: ${Math.random() * (window.innerWidth - 100)}px;
                top: ${Math.random() * (window.innerHeight - 50)}px;
                opacity: ${Math.random() * 0.08 + 0.02};
                animation-delay: ${Math.random() * 8}s;
                animation-duration: ${Math.random() * 4 + 10}s;
                font-size: ${Math.random() * 0.5 + 0.8}rem;
                font-weight: ${Math.random() > 0.5 ? '300' : '400'};
            `;
            
            container.appendChild(word);
        }

        // Refresh words periodically
        setInterval(() => {
            if (window.innerWidth > 768 && document.visibilityState === 'visible') {
                this.refreshFloatingWords(container, words);
            }
        }, 30000); // Refresh every 30 seconds
        
        console.log('✅ Enhanced floating words initialized');
    }

    refreshFloatingWords(container, words) {
        const existingWords = container.querySelectorAll('.floating-word');
        const wordToRefresh = existingWords[Math.floor(Math.random() * existingWords.length)];
        
        if (wordToRefresh) {
            wordToRefresh.style.animation = 'fadeOut 1s ease-out forwards';
            
            setTimeout(() => {
                wordToRefresh.textContent = words[Math.floor(Math.random() * words.length)];
                wordToRefresh.style.animation = 'fadeIn 1s ease-out forwards';
            }, 1000);
        }
    }

    // === DODATKOWE ULEPSZENIA ===
    initializeEnhancements() {
        this.initializePerformanceMonitoring();
        this.initializeAccessibilityFeatures();
        this.initializeLazyLoading();
        this.initializeServiceWorker();
        this.initializeAnalytics();
        
        console.log('✅ Additional enhancements initialized');
    }

    initializePerformanceMonitoring() {
        // Monitor performance and adjust animations accordingly
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
            document.body.classList.add('slow-connection');
            console.log('🐌 Slow connection detected, reducing animations');
        }

        // Monitor memory usage if available
        if ('memory' in performance) {
            const memoryInfo = performance.memory;
            if (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit > 0.8) {
                document.body.classList.add('low-memory');
                console.log('💾 Low memory detected, optimizing performance');
            }
        }
    }

    initializeAccessibilityFeatures() {
        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
            console.log('♿ Reduced motion preference detected');
        }

        // Skip link for keyboard navigation
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Przejdź do głównej treści';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    initializeLazyLoading() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            this.observers.set('images', imageObserver);
        }
    }

    initializeServiceWorker() {
        // Register service worker for caching if available
        if ('serviceWorker' in navigator && 'https:' === location.protocol.slice(0, 6)) {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.log('Service worker registration failed:', err);
            });
        }
    }

    initializeAnalytics() {
        // Simple analytics tracking
        const trackEvent = (eventName, eventData = {}) => {
            console.log('📊 Analytics event:', eventName, eventData);
            
            // Here you would integrate with your analytics service
            // gtag('event', eventName, eventData);
            // analytics.track(eventName, eventData);
        };

        // Track form interactions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'contact-form') {
                trackEvent('form_submit', {
                    form_id: 'contact-form',
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Track CTA interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-primary') || 
                e.target.classList.contains('btn-cta') ||
                e.target.classList.contains('cta-link')) {
                trackEvent('cta_click', {
                    button_text: e.target.textContent.trim(),
                    page_url: window.location.href
                });
            }
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        const trackScrollDepth = () => {
            const scrollPercent = Math.round((window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                if (scrollPercent >= 25 && scrollPercent < 50) {
                    trackEvent('scroll_depth', { depth: '25%' });
                } else if (scrollPercent >= 50 && scrollPercent < 75) {
                    trackEvent('scroll_depth', { depth: '50%' });
                } else if (scrollPercent >= 75 && scrollPercent < 90) {
                    trackEvent('scroll_depth', { depth: '75%' });
                } else if (scrollPercent >= 90) {
                    trackEvent('scroll_depth', { depth: '90%' });
                }
            }
        };

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScrollDepth, 250);
        }, { passive: true });

        this.trackEvent = trackEvent;
    }

    // === UTILITY METHODS ===
    
    // Smooth scroll to element
    scrollToElement(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element && this.lenis) {
            this.lenis.scrollTo(element, { offset });
        } else if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Show notification
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface-elevated);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            padding: 1rem 1.5rem;
            box-shadow: var(--shadow-strong);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.borderLeftColor = 'var(--color-success)';
            notification.style.borderLeftWidth = '4px';
        } else if (type === 'error') {
            notification.style.borderLeftColor = 'var(--color-error)';
            notification.style.borderLeftWidth = '4px';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        const removeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };

        setTimeout(removeNotification, duration);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', removeNotification);

        return notification;
    }

    // === CLEANUP ===
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        
        if (this.lenis) {
            this.lenis.destroy();
        }
        
        console.log('✅ Enhanced app cleaned up');
    }
}

// === CSS ANIMATIONS INJECTION ===
const injectEnhancedAnimations = () => {
    if (document.getElementById('enhanced-animations')) return;

    const style = document.createElement('style');
    style.id = 'enhanced-animations';
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

        @keyframes fadeOut {
            from { 
                opacity: 1; 
                transform: translateY(0); 
            }
            to { 
                opacity: 0; 
                transform: translateY(-20px); 
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

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        @keyframes dots {
            0%, 20% { content: '...'; }
            40% { content: ''; }
            60% { content: '.'; }
            80% { content: '..'; }
            100% { content: '...'; }
        }

        .reveal-element {
            opacity: 1 !important;
            visibility: visible !important;
        }

        .revealed {
            animation: fadeIn 0.8s ease-out forwards;
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

        .slow-connection * {
            animation: none !important;
            transition: none !important;
        }

        .slow-connection .floating-words-background {
            display: none !important;
        }

        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }

        .keyboard-navigation *:focus {
            outline: 3px solid var(--color-accent) !important;
            outline-offset: 2px !important;
        }

        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-accent);
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: var(--border-radius-small);
            z-index: 10000;
            transition: top var(--transition-normal);
            font-weight: 600;
        }

        .skip-link:focus {
            top: 6px;
        }

        .notification {
            animation: slideInFromRight 0.3s ease-out;
        }

        @keyframes slideInFromRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: var(--color-text-muted);
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all var(--transition-fast);
        }

        .notification-close:hover {
            background: var(--color-border-light);
            color: var(--color-text);
        }

        img[data-src] {
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        img[data-src].loaded {
            opacity: 1;
        }
    `;
    
    document.head.appendChild(style);
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    injectEnhancedAnimations();
    const app = new ModernApp();
    window.app = app;
    
    console.log('🎯 Enhanced app loaded successfully');
    
    // Global error handling
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        if (window.app && window.app.showNotification) {
            window.app.showNotification('Wystąpił nieoczekiwany błąd', 'error');
        }
    });
    
    // Performance monitoring
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`⚡ Page loaded in ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('⚠️ Slow page load detected');
            }
        }
    });
});
