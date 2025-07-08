// === UPROSZCZONY JAVASCRIPT v4.0 - WORKING VERSION ===

class SimpleApp {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        console.log('🚀 Initializing simple app...');
        
        // Core functionality
        this.initializeMobileMenu();
        this.initializeForm();
        this.initializeCTAPopup();
        this.initializeScrollEffects();
        this.initializeSmoothScroll();
        
        console.log('✅ App initialized successfully');
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

        // Ensure hamburger lines exist
        if (!hamburgerBtn.querySelector('.hamburger-line')) {
            hamburgerBtn.innerHTML = `
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            `;
        }

        // Toggle menu
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
                this.closeMobileMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (hamburgerBtn.classList.contains('active') && 
                !mainNav.contains(e.target) && 
                !hamburgerBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && hamburgerBtn.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        console.log('✅ Mobile menu initialized');
    }

    closeMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mainNav = document.getElementById('main-nav');
        const header = document.querySelector('.main-header');

        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        if (mainNav) mainNav.classList.remove('mobile-active');
        if (header) header.classList.remove('nav-open');
        document.body.classList.remove('nav-open');
    }

    // === UPROSZCZONY FORMULARZ ===
    initializeForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        console.log('✅ Initializing simple form...');

        // Form elements
        const elements = {
            form: form,
            submitButton: form.querySelector('.btn-submit'),
            successState: document.getElementById('form-success-state'),
            mainError: document.getElementById('form-main-error'),
            phoneInput: document.getElementById('phone'),
            goalRadios: form.querySelectorAll('input[name="goal"]'),
            otherGoalWrapper: document.getElementById('other-goal-wrapper'),
            otherGoalInput: document.getElementById('other-goal-text')
        };

        // Phone formatting
        if (elements.phoneInput) {
            elements.phoneInput.addEventListener('input', (e) => {
                let input = e.target.value.replace(/\D/g, '').substring(0, 9);
                e.target.value = input.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
            });
        }

        // Goal selection with "other" option
        elements.goalRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const otherSelected = radio.value === 'inny' && radio.checked;
                
                if (elements.otherGoalWrapper) {
                    elements.otherGoalWrapper.style.display = otherSelected ? 'block' : 'none';
                }
                
                if (elements.otherGoalInput) {
                    elements.otherGoalInput.required = otherSelected;
                    if (!otherSelected) {
                        elements.otherGoalInput.value = '';
                    }
                }
            });
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(elements);
        });

        console.log('✅ Form initialized');
    }

    validateField(field) {
        const value = field.value.trim();
        const errorSpan = field.closest('.form-group')?.querySelector('.error-message');
        let isValid = true;
        let message = '';

        // Validation rules
        if (field.required && value === '') {
            isValid = false;
            message = 'To pole jest wymagane.';
        } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            message = 'Proszę podać poprawny adres e-mail.';
        } else if (field.type === 'tel' && value) {
            const phoneNumber = value.replace(/\s/g, '');
            if (phoneNumber.length < 9) {
                isValid = false;
                message = 'Numer telefonu musi mieć co najmniej 9 cyfr.';
            }
        }

        // Update field style
        field.classList.remove('valid', 'error');
        if (isValid && value) {
            field.classList.add('valid');
        } else if (!isValid) {
            field.classList.add('error');
        }

        // Show/hide error message
        if (errorSpan) {
            if (!isValid && message) {
                errorSpan.textContent = message;
                errorSpan.classList.add('visible');
            } else {
                errorSpan.classList.remove('visible');
            }
        }

        return isValid;
    }

    async handleFormSubmit(elements) {
        const { form, submitButton, successState, mainError } = elements;
        
        // Validate all required fields
        const requiredFields = form.querySelectorAll('input[required], select[required]');
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
            const goalError = form.querySelector('input[name="goal"]')
                ?.closest('.form-group')?.querySelector('.error-message');
            if (goalError) {
                goalError.textContent = 'Proszę wybrać cel nauki.';
                goalError.classList.add('visible');
            }
        }

        if (!isValid) {
            if (mainError) {
                mainError.textContent = "Proszę uzupełnić wszystkie wymagane pola.";
                mainError.classList.add('visible');
            }
            return;
        }

        // Hide error
        if (mainError) {
            mainError.classList.remove('visible');
        }

        // Update submit button
        if (submitButton) {
            submitButton.disabled = true;
            const buttonText = submitButton.querySelector('.btn-text');
            if (buttonText) {
                buttonText.textContent = 'Wysyłanie...';
            }
        }

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success
            this.showFormSuccess(form, successState);
            
        } catch (error) {
            console.error('Form submission failed:', error);
            if (mainError) {
                mainError.textContent = 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.';
                mainError.classList.add('visible');
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                const buttonText = submitButton.querySelector('.btn-text');
                if (buttonText) {
                    buttonText.textContent = '📤 Wyślij wiadomość';
                }
            }
        }
    }

    showFormSuccess(form, successState) {
        if (!successState) return;

        // Hide form
        form.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        form.style.opacity = '0';
        form.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            form.style.display = 'none';
            successState.style.visibility = 'visible';
            successState.style.opacity = '1';
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

        // Make sure elements are visible
        openBtn.style.opacity = '1';
        openBtn.style.visibility = 'visible';
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        modal.style.display = 'none';

        const openModal = () => {
            if (isOpen) return;
            isOpen = true;
            
            openBtn.style.display = 'none';
            modal.style.display = 'block';
            
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.style.transform = 'scale(1)';
            }, 10);
        };

        const closeModal = () => {
            if (!isOpen) return;
            isOpen = false;
            
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                modal.style.display = 'none';
                openBtn.style.display = 'flex';
            }, 300);
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

    // === SCROLL EFFECTS ===
    initializeScrollEffects() {
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.main-header');
            if (header) {
                header.classList.toggle('scrolled', window.pageYOffset > 50);
            }
        }, { passive: true });

        // Simple reveal animation
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe reveal elements
            document.querySelectorAll('.reveal-element, .animated-headline').forEach(element => {
                // Make sure elements are visible
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                observer.observe(element);
            });
        }

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

                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);

                console.log('✅ Smooth scroll initialized');
            } catch (error) {
                console.warn('Smooth scroll failed:', error);
            }
        }
    }

    // === FLOATING WORDS (optional) ===
    initializeFloatingWords() {
        const container = document.getElementById('floating-words-container');
        if (!container || window.innerWidth < 768) return;

        const words = [
            'Hello', 'Bonjour', 'Płynność', 'Fluency', 'Grammar', 'Conversation', 'Cześć', 
            'Apprendre', 'Learn', 'Merci', 'Thanks', 'Język', 'Słowa', 'Words', 'Dialogue',
            'EN', 'FR', 'PL', 'Parler', 'Speak', 'Écouter', 'Listen', 'Culture', 'Sukces'
        ];
        
        const wordCount = Math.min(25, Math.floor(window.innerWidth / 50));
        
        for (let i = 0; i < wordCount; i++) {
            const word = document.createElement('span');
            word.className = 'floating-word';
            word.textContent = words[i % words.length];
            word.style.left = Math.random() * (window.innerWidth - 100) + 'px';
            word.style.top = Math.random() * (window.innerHeight - 50) + 'px';
            word.style.opacity = Math.random() * 0.1 + 0.05;
            container.appendChild(word);
        }
        
        console.log('✅ Floating words initialized');
    }
}

// === CSS ANIMATIONS ===
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// === INITIALIZE APP ===
const app = new SimpleApp();

// Make available globally for debugging
window.app = app;
