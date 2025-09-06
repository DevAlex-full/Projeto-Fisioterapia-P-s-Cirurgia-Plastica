/**
 * Engine.js Otimizado - Fisioterapia Pós-Cirurgia Plástica
 */

// ===== ESTADO E CONFIGURAÇÃO =====
const App = {
    elements: {},
    state: { currentTestimonial: 0, isMenuOpen: false, isLoading: false },
    config: { testimonialInterval: 5000, scrollOffset: 80 }
};

// ===== UTILITÁRIOS =====
const utils = {
    debounce: (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },
    throttle: (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    smoothScrollTo: el => window.scrollTo({ top: el.offsetTop - App.config.scrollOffset, behavior: 'smooth' }),
    isElementVisible: el => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
    },
    isValidEmail: email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isValidPhone: phone => /^\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}$/.test(phone.replace(/\D/g, '')),
    formatPhone: phone => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 11 ? cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') :
               cleaned.length === 10 ? cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3') : phone;
    }
};

// ===== CACHE DOM E EVENTOS =====
const DOM = {
    cache: () => {
        App.elements = {
            navbar: document.querySelector('.navbar'),
            navToggle: document.querySelector('.nav-toggle'),
            navMenu: document.querySelector('.nav-menu'),
            navLinks: document.querySelectorAll('.nav-link'),
            testimonialItems: document.querySelectorAll('.testimonial-item'),
            testimonialDots: document.querySelectorAll('.dot'),
            contactForm: document.querySelector('.contact-form'),
            formInputs: document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea'),
            fadeElements: document.querySelectorAll('.service-card, .highlight-item, .about-description')
        };
    },
    bindEvents: () => {
        const { elements } = App;
        elements.navToggle?.addEventListener('click', Navigation.toggleMenu);
        elements.navLinks.forEach(link => link.addEventListener('click', Navigation.handleNavClick));
        elements.testimonialDots.forEach(dot => dot.addEventListener('click', Testimonials.handleDotClick));
        elements.contactForm?.addEventListener('submit', Form.handleSubmit);
        elements.formInputs.forEach(input => {
            input.addEventListener('blur', Form.validateField);
            input.addEventListener('input', Form.clearErrors);
        });
        window.addEventListener('scroll', utils.throttle(ScrollEffects.handleScroll, 16));
        window.addEventListener('resize', utils.debounce(Layout.handleResize, 250));
    }
};

// ===== NAVEGAÇÃO =====
const Navigation = {
    toggleMenu: () => {
        App.state.isMenuOpen = !App.state.isMenuOpen;
        const { navMenu, navToggle } = App.elements;
        navMenu.classList.toggle('active', App.state.isMenuOpen);
        navToggle.classList.toggle('active', App.state.isMenuOpen);
        document.body.style.overflow = App.state.isMenuOpen ? 'hidden' : '';
    },
    handleNavClick: e => {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        if (href?.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                utils.smoothScrollTo(target);
                if (App.state.isMenuOpen) Navigation.toggleMenu();
                Navigation.updateActiveLink(href);
            }
        }
    },
    updateActiveLink: activeHref => {
        App.elements.navLinks.forEach(link => 
            link.classList.toggle('active', link.getAttribute('href') === activeHref)
        );
    },
    updateNavbarOnScroll: () => App.elements.navbar.classList.toggle('scrolled', window.pageYOffset > 50)
};

// ===== TESTIMONIALS =====
const Testimonials = {
    init: () => {
        if (App.elements.testimonialItems.length > 0) {
            setInterval(() => !document.hidden && Testimonials.nextTestimonial(), App.config.testimonialInterval);
        }
    },
    showTestimonial: index => {
        App.elements.testimonialItems.forEach((item, i) => item.classList.toggle('active', i === index));
        App.elements.testimonialDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        App.state.currentTestimonial = index;
    },
    nextTestimonial: () => {
        const nextIndex = (App.state.currentTestimonial + 1) % App.elements.testimonialItems.length;
        Testimonials.showTestimonial(nextIndex);
    },
    handleDotClick: e => {
        const index = parseInt(e.target.dataset.slide);
        if (!isNaN(index)) Testimonials.showTestimonial(index);
    }
};

// ===== FORMULÁRIO =====
const Form = {
    handleSubmit: async e => {
        e.preventDefault();
        if (App.state.isLoading) return;
        
        const data = Object.fromEntries(new FormData(e.target));
        if (Form.validateForm(data)) await Form.submitForm(data);
    },
    validateForm: data => {
        const errors = {};
        if (!data.name || data.name.trim().length < 2) errors.name = 'Nome deve ter pelo menos 2 caracteres';
        if (!data.email || !utils.isValidEmail(data.email)) errors.email = 'Email inválido';
        if (!data.phone || !utils.isValidPhone(data.phone)) errors.phone = 'Telefone inválido';
        if (!data.service) errors.service = 'Selecione um serviço';
        
        Form.showErrors(errors);
        return Object.keys(errors).length === 0;
    },
    validateField: e => {
        const { name, value } = e.target;
        let error = '';
        switch (name) {
            case 'name': if (value.trim().length < 2) error = 'Nome deve ter pelo menos 2 caracteres'; break;
            case 'email': if (value && !utils.isValidEmail(value)) error = 'Email inválido'; break;
            case 'phone': if (value && !utils.isValidPhone(value)) error = 'Telefone inválido'; break;
        }
        Form.showFieldError(e.target, error);
    },
    clearErrors: e => Form.showFieldError(e.target, ''),
    showFieldError: (field, error) => {
        const group = field.closest('.form-group');
        let errorElement = group.querySelector('.field-error');
        
        if (error) {
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'field-error';
                group.appendChild(errorElement);
            }
            errorElement.textContent = error;
            field.classList.add('error');
        } else {
            errorElement?.remove();
            field.classList.remove('error');
        }
    },
    showErrors: errors => {
        Object.entries(errors).forEach(([fieldName, error]) => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field) Form.showFieldError(field, error);
        });
    },
    submitForm: async data => {
        App.state.isLoading = true;
        const btn = App.elements.contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            Form.showAlert('Mensagem enviada com sucesso! Retornaremos em breve.', 'success');
            App.elements.contactForm.reset();
        } catch {
            Form.showAlert('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            App.state.isLoading = false;
            btn.textContent = originalText;
            btn.disabled = false;
        }
    },
    showAlert: (message, type) => {
        const alert = document.createElement('div');
        alert.className = `form-alert form-alert--${type}`;
        alert.textContent = message;
        App.elements.contactForm.prepend(alert);
        setTimeout(() => alert.remove(), 5000);
    }
};

// ===== EFEITOS DE SCROLL =====
const ScrollEffects = {
    handleScroll: () => {
        Navigation.updateNavbarOnScroll();
        ScrollEffects.animateOnScroll();
        ScrollEffects.updateActiveSection();
    },
    animateOnScroll: () => {
        App.elements.fadeElements.forEach(element => {
            if (utils.isElementVisible(element)) {
                element.classList.add('fade-in', 'visible');
            }
        });
    },
    updateActiveSection: () => {
        const sections = document.querySelectorAll('section[id]');
        let activeSection = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) activeSection = `#${section.id}`;
        });
        if (activeSection) Navigation.updateActiveLink(activeSection);
    }
};

// ===== LAYOUT =====
const Layout = {
    handleResize: () => {
        if (window.innerWidth > 768 && App.state.isMenuOpen) Navigation.toggleMenu();
        Layout.updateViewportHeight();
    },
    updateViewportHeight: () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
};

// ===== RECURSOS =====
const Features = {
    addInputMask: () => {
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', e => e.target.value = utils.formatPhone(e.target.value));
        });
    },
    enhanceAccessibility: () => {
        const { navToggle } = App.elements;
        if (navToggle) {
            navToggle.setAttribute('aria-label', 'Alternar menu de navegação');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    },
    addDynamicStyles: () => {
        const styles = `
            .field-error { display: block; font-size: 0.6rem; color: #e74c3c; margin-top: 4px; }
            .form-group input.error, .form-group select.error, .form-group textarea.error { 
                border-color: #e74c3c; background-color: rgba(231, 76, 60, 0.1); 
            }
            .form-alert { padding: var(--spacing-sm); margin-bottom: var(--spacing-sm); 
                border-radius: var(--radius-sm); font-size: 0.7rem; }
            .form-alert--success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .form-alert--error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            .btn:disabled { opacity: 0.6; cursor: not-allowed; }
            *:focus-visible { outline: 3px solid var(--secondary-color) !important; outline-offset: 2px !important; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
};

// ===== INICIALIZAÇÃO =====
const AppInit = {
    init: () => {
        document.readyState === 'loading' 
            ? document.addEventListener('DOMContentLoaded', AppInit.start)
            : AppInit.start();
    },
    start: () => {
        try {
            DOM.cache();
            DOM.bindEvents();
            Testimonials.init();
            Layout.updateViewportHeight();
            ScrollEffects.handleScroll();
            Features.addInputMask();
            Features.enhanceAccessibility();
            Features.addDynamicStyles();
            document.body.classList.remove('loading');
            console.log('Site inicializado com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar:', error);
        }
    }
};

// ===== INICIALIZAÇÃO =====
AppInit.init();