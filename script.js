document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined') { console.error("GSAP not loaded!"); return; }
    gsap.registerPlugin(ScrollTrigger);
    
    if (typeof Lenis !== 'undefined') { initializeSmoothScroll(); }
    
    initializePageLoadAnimations();
    initializeMobileMenu();
    
    if (document.getElementById('floating-words-container')) { initializeFloatingWords(); }
    if (document.getElementById('contact-form')) { initializeFormInteraction(document.getElementById('contact-form')); }
    if (document.getElementById('cta-popup')) { initializeCallToAction(); }
    if (document.querySelector('.faq-accordion')) { initializeFaqAccordion(); }
});

function initializeSmoothScroll() {
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

function initializePageLoadAnimations() {
    gsap.utils.toArray('.animated-headline').forEach(headline => {
        gsap.from(headline, {
            autoAlpha: 0, filter: 'blur(10px)', y: 30,
            duration: 1.5, ease: 'expo.out', delay: 0.5
        });
    });
    
    gsap.utils.toArray('.reveal-element').forEach(element => {
        gsap.from(element, {
            autoAlpha: 0, y: 50, duration: 1.5, ease: 'expo.out',
            scrollTrigger: {
                trigger: element, start: 'top 90%', toggleActions: 'play none none none',
            }
        });
    });

    const parallaxImage = document.querySelector('.image-parallax');
    if (parallaxImage) {
        gsap.to(parallaxImage, {
            yPercent: -15, ease: 'none',
            scrollTrigger: {
                trigger: parallaxImage.closest('.about-me-image-wrapper'),
                start: 'top bottom', end: 'bottom top', scrub: true
            }
        });
    }
}

function initializeMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav = document.getElementById('main-nav');
    const header = document.querySelector('.main-header');
    hamburgerBtn.addEventListener('click', () => {
        const isActive = hamburgerBtn.classList.toggle('active');
        mainNav.classList.toggle('mobile-active', isActive);
        header.classList.toggle('nav-open', isActive);
        document.body.classList.toggle('nav-open', isActive);
    });
}

function initializeFloatingWords() {
    const container = document.getElementById('floating-words-container');
    if (!container || window.innerWidth < 768) return;
    const words = [
        'Hello', 'Bonjour', 'Płynność', 'Fluency', 'Grammar', 'Conversation', 'Cześć', 
        'Apprendre', 'Learn', 'Merci', 'Thanks', 'Język', 'Słowa', 'Words', 'Dialogue',
        'EN', 'FR', 'PL', 'Parler', 'Speak', 'Écouter', 'Listen', 'Culture', 'Sukces',
        'Oui', 'Yes', 'Non', 'No', 'Savoir', 'To know', 'Español', 'Hola', 'DE', 'Guten Tag'
    ];
    for (let i = 0; i < 40; i++) {
        let word = document.createElement('span');
        word.className = 'floating-word';
        word.textContent = words[i % words.length];
        container.appendChild(word);
        gsap.set(word, {
            x: `random(5, ${window.innerWidth - 100})`,
            y: `random(5, ${window.innerHeight - 50})`,
            scale: `random(0.5, 1)`,
            autoAlpha: 0
        });
        const animateWord = (element) => {
            gsap.to(element, {
                x: `random(0, ${window.innerWidth})`,
                y: `random(0, ${window.innerHeight})`,
                duration: `random(30, 50)`,
                autoAlpha: `random(0.01, 0.04)`,
                scale: `random(0.7, 1.2)`,
                ease: 'none',
                onComplete: () => animateWord(element)
            });
        };
        gsap.to(word, { autoAlpha: `random(0.01, 0.04)`, delay: `random(0, 10)`, duration: 3 });
        animateWord(word);
    }
}

function initializeCallToAction() {
    const popup = document.getElementById('cta-popup');
    const openBtn = document.getElementById('cta-open-btn');
    const closeBtn = document.getElementById('cta-close-btn');
    const modal = popup.querySelector('.cta-modal');

    gsap.set(modal, { autoAlpha: 0, visibility: 'hidden' });
    const tl = gsap.timeline({ paused: true, reversed: true });

    tl.to(openBtn, { scale: 0, autoAlpha: 0, duration: 0.3, ease: 'back.in(1.7)' })
      .set(modal, { visibility: 'visible' })
      .to(modal, {
          autoAlpha: 1, width: '320px', height: 'auto',
          duration: 0.6, ease: 'expo.out'
      }, "-=0.2")
      .to(modal.querySelectorAll('h3, p, a'), { autoAlpha: 1, stagger: 0.05, duration: 0.5 }, "-=0.4");

    openBtn.addEventListener('click', () => tl.play());
    closeBtn.addEventListener('click', () => tl.reverse());
}

function initializeFaqAccordion() {
    gsap.utils.toArray('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        gsap.set(answer, { maxHeight: 0, autoAlpha: 0, paddingTop: 0, paddingBottom: 0, margin: 0 });
        question.addEventListener('click', () => {
            const isActive = item.classList.toggle('active');
            gsap.to(answer, {
                maxHeight: isActive ? '1000px' : 0,
                autoAlpha: isActive ? 1 : 0,
                paddingTop: isActive ? '0.5rem' : 0,
                paddingBottom: isActive ? '1.5rem' : 0,
                duration: 0.5,
                ease: 'power3.inOut'
            });
        });
    });
}

function initializeFormInteraction(form) {
    const allRequiredInputs = form.querySelectorAll('input[required]');
    const submitButton = form.querySelector('.btn-submit');
    const successState = document.getElementById('form-success-state');
    const mainError = document.getElementById('form-main-error');
    const sliderContainer = form.querySelector('.slider-container');
    const slider = document.getElementById('level-slider');
    const sliderValueDisplay = document.getElementById('slider-value');
    const sliderLegendDisplay = document.getElementById('slider-legend');
    const decrementBtn = document.getElementById('slider-decrement');
    const incrementBtn = document.getElementById('slider-increment');
    
    const sliderLevels = [
        "0 - Brak znajomości", "A1 - Początkujący", "A1/A2", "A2 - Podstawowy", "A2/B1", 
        "B1 - Średnio-zaawansowany", "B1/B2", "B2 - Wyższy średnio-zaawansowany",
        "B2/C1", "C1 - Zaawansowany", "C2 - Poziom biegły"
    ];
    
    function updateSliderDisplay() {
        const value = parseInt(slider.value);
        const max = parseInt(slider.max);
        const min = parseInt(slider.min);
        const percent = ((value - min) / (max - min)) * 100;
        
        sliderValueDisplay.textContent = value;
        sliderLegendDisplay.textContent = sliderLevels[value];
        slider.style.backgroundSize = `${percent}% 100%`;

        let colorVar;
        if (value <= 3) colorVar = 'var(--color-error)';
        else if (value <= 7) colorVar = 'var(--color-warn)';
        else colorVar = 'var(--color-success)';
        
        gsap.to(sliderContainer, { '--current-slider-color': colorVar, duration: 0.4 });
        validateField(slider, true);
    }
    slider.addEventListener('input', updateSliderDisplay);
    decrementBtn.addEventListener('click', () => { if(parseInt(slider.value) > parseInt(slider.min)) { slider.value--; slider.dispatchEvent(new Event('input')); } });
    incrementBtn.addEventListener('click', () => { if(parseInt(slider.value) < parseInt(slider.max)) { slider.value++; slider.dispatchEvent(new Event('input')); } });
    updateSliderDisplay();

    const goalRadios = form.querySelectorAll('input[name="goal"]');
    const otherGoalWrapper = document.getElementById('other-goal-wrapper');
    const otherGoalInput = document.getElementById('other-goal-text');

    goalRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            goalRadios.forEach(r => r.closest('.radio-card').classList.remove('selected'));
            const selectedCard = radio.closest('.radio-card');
            if (radio.checked) selectedCard.classList.add('selected');
            
            const otherIsSelected = radio.value === 'inny' && radio.checked;
            otherGoalWrapper.classList.toggle('visible', otherIsSelected);
            otherGoalInput.required = otherIsSelected;
            if (!otherIsSelected) {
                otherGoalInput.value = '';
                validateField(otherGoalInput, false);
            }
            validateField(radio, true);
        });
    });

    document.getElementById('phone').addEventListener('input', e => {
        let input = e.target.value.replace(/\D/g, '').substring(0, 9);
        e.target.value = input.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
    });

    const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    textInputs.forEach(field => {
        field.addEventListener('input', () => validateField(field, false));
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let isFormValid = true;
        allRequiredInputs.forEach(field => {
            if (!validateField(field, true)) isFormValid = false;
        });

        if (isFormValid) {
            mainError.classList.remove('visible');
            submitButton.disabled = true;
            submitButton.querySelector('.btn-text').textContent = 'Wysyłanie...';
            
            setTimeout(() => {
                const tl = gsap.timeline();
                tl.to(form, { autoAlpha: 0, y: -50, duration: 0.5, ease: 'power3.in' })
                  .set(successState, { autoAlpha: 1, visibility: 'visible' })
                  .from(successState.querySelector('.success-icon'), { scale: 0, ease: 'back.out(1.7)', duration: 0.5 })
                  .from(successState.querySelectorAll('h2, p'), { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.3");
            }, 1500);
        } else {
            mainError.textContent = "Proszę uzupełnić wszystkie wymagane pola oznaczone gwiazdką.";
            mainError.classList.add('visible');
            gsap.from(mainError, { y: -10, autoAlpha: 0, duration: 0.3 });
        }
    });

    function validateField(field, forceShowError = true) {
        const formGroup = field.closest('.form-group');
        const errorSpan = formGroup.querySelector('.error-message');
        let isValid = true;
        let message = '';
        
        const value = field.value ? field.value.trim() : '';
        const fieldToStyle = field.type === 'range' ? sliderContainer : field;

        if (field.required) {
            if (field.name === 'goal') {
                if (!form.querySelector('input[name="goal"]:checked')) {
                    isValid = false; if (forceShowError) message = 'Proszę wybrać cel.';
                }
            } else if (field.type === 'range') {
                isValid = true;
            } else if (value === '') {
                isValid = false; if (forceShowError) message = 'To pole jest wymagane.';
            } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false; message = 'Proszę podać poprawny adres e-mail.';
            } else if (field.type === 'tel' && value.replace(/\s/g, '').length < 9) {
                isValid = false; message = 'Numer telefonu musi mieć co najmniej 9 cyfr.';
            } else if (field.id === 'other-goal-text' && value === '') {
                isValid = false; if (forceShowError) message = 'Proszę opisać swój cel.';
            }
        }
        
        fieldToStyle.classList.remove('valid', 'error');
        if (errorSpan) errorSpan.classList.remove('visible');

        if (isValid && field.required) {
            if((field.type !== 'radio' && value !== '') || field.type === 'range' || (field.type === 'radio' && form.querySelector('input[name="goal"]:checked'))) {
                 fieldToStyle.classList.add('valid');
            }
        } else if (message) {
            fieldToStyle.classList.add('error');
            if (errorSpan) {
                errorSpan.textContent = message;
                errorSpan.classList.add('visible');
            }
        }
        return isValid;
    }
}