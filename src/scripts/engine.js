/**
 * Engine.js Otimizado - Fisioterapia
 */

// Estado
const App = {
    e: {},
    s: { ct: 0, im: false, il: false }
};

// Utils
const u = {
    d: (f, w) => {
        let t;
        return (...a) => {
            clearTimeout(t);
            t = setTimeout(() => f(...a), w);
        };
    },
    th: (f, l) => {
        let i;
        return (...a) => {
            if (!i) {
                f(...a);
                i = true;
                setTimeout(() => i = false, l);
            }
        };
    },
    ss: el => window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' }),
    ve: el => el.getBoundingClientRect().top < window.innerHeight * 0.8,
    ve2: e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
    vp: p => /^\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}$/.test(p.replace(/\D/g, '')),
    fp: p => {
        const c = p.replace(/\D/g, '');
        return c.length === 11 ? c.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') :
               c.length === 10 ? c.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3') : p;
    }
};

// DOM
const DOM = {
    c: () => {
        App.e = {
            n: document.querySelector('.navbar'),
            nt: document.querySelector('.nav-toggle'),
            nm: document.querySelector('.nav-menu'),
            nl: document.querySelectorAll('.nav-link'),
            ti: document.querySelectorAll('.testimonial-item'),
            td: document.querySelectorAll('.dot'),
            cf: document.querySelector('.contact-form'),
            fi: document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea'),
            fe: document.querySelectorAll('.service-card, .highlight-item, .about-description')
        };
    },
    b: () => {
        const { e } = App;
        e.nt?.addEventListener('click', Nav.tm);
        e.nl.forEach(l => l.addEventListener('click', Nav.hnc));
        e.td.forEach(d => d.addEventListener('click', Test.hdc));
        e.cf?.addEventListener('submit', Form.hs);
        e.fi.forEach(i => {
            i.addEventListener('blur', Form.vf);
            i.addEventListener('input', Form.ce);
        });
        window.addEventListener('scroll', u.th(Scroll.hs, 16));
        window.addEventListener('resize', u.d(Layout.hr, 250));
    }
};

// Nav
const Nav = {
    tm: () => {
        App.s.im = !App.s.im;
        const { nm, nt } = App.e;
        nm.classList.toggle('active', App.s.im);
        nt.classList.toggle('active', App.s.im);
        document.body.style.overflow = App.s.im ? 'hidden' : '';
    },
    hnc: e => {
        e.preventDefault();
        const h = e.target.getAttribute('href');
        if (h?.startsWith('#')) {
            const t = document.querySelector(h);
            if (t) {
                u.ss(t);
                if (App.s.im) Nav.tm();
                Nav.ual(h);
            }
        }
    },
    ual: ah => {
        App.e.nl.forEach(l => 
            l.classList.toggle('active', l.getAttribute('href') === ah)
        );
    },
    unos: () => App.e.n.classList.toggle('scrolled', window.pageYOffset > 50)
};

// Test
const Test = {
    i: () => {
        if (App.e.ti.length > 0) {
            setInterval(() => !document.hidden && Test.nt(), 5000);
        }
    },
    st: i => {
        App.e.ti.forEach((it, idx) => it.classList.toggle('active', idx === i));
        App.e.td.forEach((d, idx) => d.classList.toggle('active', idx === i));
        App.s.ct = i;
    },
    nt: () => {
        const ni = (App.s.ct + 1) % App.e.ti.length;
        Test.st(ni);
    },
    hdc: e => {
        const i = parseInt(e.target.dataset.slide);
        if (!isNaN(i)) Test.st(i);
    }
};

// Form
const Form = {
    hs: async e => {
        e.preventDefault();
        if (App.s.il) return;
        
        const d = Object.fromEntries(new FormData(e.target));
        if (Form.vfo(d)) await Form.sf(d);
    },
    vfo: d => {
        const er = {};
        if (!d.name || d.name.trim().length < 2) er.name = 'Nome deve ter pelo menos 2 caracteres';
        if (!d.email || !u.ve2(d.email)) er.email = 'Email inválido';
        if (!d.phone || !u.vp(d.phone)) er.phone = 'Telefone inválido';
        if (!d.service) er.service = 'Selecione um serviço';
        
        Form.ser(er);
        return Object.keys(er).length === 0;
    },
    vf: e => {
        const { name, value } = e.target;
        let er = '';
        switch (name) {
            case 'name': if (value.trim().length < 2) er = 'Nome deve ter pelo menos 2 caracteres'; break;
            case 'email': if (value && !u.ve2(value)) er = 'Email inválido'; break;
            case 'phone': if (value && !u.vp(value)) er = 'Telefone inválido'; break;
        }
        Form.sfe(e.target, er);
    },
    ce: e => Form.sfe(e.target, ''),
    sfe: (f, er) => {
        const g = f.closest('.form-group');
        let ee = g.querySelector('.field-error');
        
        if (er) {
            if (!ee) {
                ee = document.createElement('span');
                ee.className = 'field-error';
                g.appendChild(ee);
            }
            ee.textContent = er;
            f.classList.add('error');
        } else {
            ee?.remove();
            f.classList.remove('error');
        }
    },
    ser: er => {
        Object.entries(er).forEach(([fn, er]) => {
            const f = document.querySelector(`[name="${fn}"]`);
            if (f) Form.sfe(f, er);
        });
    },
    sf: async d => {
        App.s.il = true;
        const btn = App.e.cf.querySelector('button[type="submit"]');
        const ot = btn.textContent;
        
        btn.textContent = 'Gerando WhatsApp...';
        btn.disabled = true;
        
        try {
            // Criar mensagem do WhatsApp
            const sv = {
                'drenagem': 'Drenagem Linfática',
                'ultrassom': 'Ultrassom Terapêutico',
                'radiofrequencia': 'Radiofrequência',
                'mobilizacao': 'Mobilização Cicatricial',
                'exercicios': 'Exercícios Terapêuticos',
                'orientacoes': 'Orientações Pós-Operatórias'
            };
            
            const msg = `Olá! Gostaria de solicitar um orçamento:

📋 *DADOS:*
• Nome: ${d.name}
• Email: ${d.email}
• Telefone: ${d.phone}
• Serviço: ${sv[d.service] || d.service}

💬 *Mensagem:*
${d.message || 'Não informado'}

Aguardo o contato!`;
            
            const wa = `https://wa.me/5511960354728?text=${encodeURIComponent(msg)}`;
            
            await new Promise(r => setTimeout(r, 1000));
            
            window.open(wa, '_blank');
            Form.sal('Redirecionando para WhatsApp! Complete seu orçamento por lá.', 'success');
            App.e.cf.reset();
        } catch {
            Form.sal('Erro ao gerar WhatsApp. Tente novamente.', 'error');
        } finally {
            App.s.il = false;
            btn.textContent = ot;
            btn.disabled = false;
        }
    },
    sal: (msg, type) => {
        const al = document.createElement('div');
        al.className = `form-alert form-alert--${type}`;
        al.textContent = msg;
        App.e.cf.prepend(al);
        setTimeout(() => al.remove(), 5000);
    }
};

// Scroll
const Scroll = {
    hs: () => {
        Nav.unos();
        Scroll.aos();
        Scroll.uas();
    },
    aos: () => {
        App.e.fe.forEach(el => {
            if (u.ve(el)) {
                el.classList.add('fade-in', 'visible');
            }
        });
    },
    uas: () => {
        const ss = document.querySelectorAll('section[id]');
        let as = '';
        ss.forEach(s => {
            const r = s.getBoundingClientRect();
            if (r.top <= 100 && r.bottom >= 100) as = `#${s.id}`;
        });
        if (as) Nav.ual(as);
    }
};

// Layout
const Layout = {
    hr: () => {
        if (window.innerWidth > 768 && App.s.im) Nav.tm();
        Layout.uvh();
    },
    uvh: () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
};

// Features
const Features = {
    aim: () => {
        document.querySelectorAll('input[type="tel"]').forEach(i => {
            i.addEventListener('input', e => e.target.value = u.fp(e.target.value));
        });
    },
    ea: () => {
        const { nt } = App.e;
        if (nt) {
            nt.setAttribute('aria-label', 'Alternar menu');
            nt.setAttribute('aria-expanded', 'false');
        }
    }
};

// Init
const Init = {
    i: () => {
        document.readyState === 'loading' 
            ? document.addEventListener('DOMContentLoaded', Init.s)
            : Init.s();
    },
    s: () => {
        try {
            DOM.c();
            DOM.b();
            Test.i();
            Layout.uvh();
            Scroll.hs();
            Features.aim();
            Features.ea();
            document.body.classList.remove('loading');
        } catch (er) {
            console.error('Erro:', er);
        }
    }
};

Init.i();