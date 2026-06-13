import React, { useState, useEffect, useRef } from 'react';
import {
  Phone, Mail, MapPin, Instagram, Clock, Award, Heart,
  ChevronRight, Menu, X, CheckCircle, Star, Sparkles,
  Shield, Zap, Target, ArrowRight, Play, Calendar, MessageCircle,
  Send, Quote, ChevronLeft, ChevronDown, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DEFAULT_HERO = {
  titulo:'Recuperação', subtitulo:'Extraordinária',
  descricao:'Fisioterapia especializada que transforma sua recuperação pós-cirúrgica em uma experiência rápida, segura e confortável.',
  badge:'Especialista em Pós-Operatório',
  ctaPrimario:'Agendar Avaliação Gratuita', ctaSecundario:'Conhecer Tratamentos',
  videoUrl:'/videos/apresentacao.mp4', posterUrl:'/images/foto-sobre.png',
};
const DEFAULT_ABOUT = {
  nome:'Débora Santiago',
  descricao1:'Sou fisioterapeuta especializada em pós-operatório de cirurgias plásticas, com mais de 10 anos de experiência e formação avançada em drenagem linfática e técnicas de reabilitação dermato-funcional.',
  descricao2:'Minha missão é proporcionar uma recuperação segura, rápida e confortável, potencializando os resultados da sua cirurgia através de protocolos personalizados e atendimento humanizado.',
  fotoUrl:'/images/foto-sobre.png', anosExp:10, pacientes:500,
  satisfacao:98, especializacoes:15,
  crefito:'CREFITO-3', especialidade:'Especialista Dermato-Funcional',
};
const DEFAULT_SERVICOS = [
  { id:'s1', titulo:'Drenagem Linfática',        descricao:'Técnica especializada com movimentos suaves para reduzir edemas e acelerar a recuperação.', icone:'💆‍♀️', beneficios:['Reduz inchaço em até 70%','Acelera cicatrização','Melhora circulação','Desintoxica o organismo'], duracao:'60 min', cor:'from-purple-400 to-purple-600' },
  { id:'s2', titulo:'Ultrassom Terapêutico',      descricao:'Ondas sonoras para regeneração tecidual profunda e aceleração da cicatrização.',             icone:'🔊', beneficios:['Regeneração profunda','Tratamento indolor','Resultados rápidos','Recuperação acelerada'],   duracao:'45 min', cor:'from-blue-400 to-blue-600' },
  { id:'s3', titulo:'Radiofrequência',             descricao:'Estimula colágeno, promove firmeza da pele e melhora a circulação local.',                   icone:'⚡', beneficios:['Firmeza da pele','Estimula colágeno','Efeito lifting','Rejuvenescimento'],                  duracao:'50 min', cor:'from-orange-400 to-orange-600' },
  { id:'s4', titulo:'Mobilização Cicatricial',    descricao:'Técnicas manuais para melhorar a qualidade e aparência de cicatrizes.',                       icone:'✋', beneficios:['Cicatrizes suaves','Maior mobilidade','Menos aderências','Melhora estética'],            duracao:'40 min', cor:'from-green-400 to-green-600' },
  { id:'s5', titulo:'Exercícios Terapêuticos',    descricao:'Programa personalizado para fortalecimento e recuperação funcional completa.',                icone:'💪', beneficios:['Fortalecimento','Prevenção','Autonomia','Resultados duradouros'],                        duracao:'55 min', cor:'from-red-400 to-red-600' },
  { id:'s6', titulo:'Orientações Pós-Operatórias', descricao:'Acompanhamento completo com orientações para uma recuperação segura.',                      icone:'📋', beneficios:['Recuperação segura','Suporte 24/7','Melhores resultados','Tranquilidade total'],        duracao:'30 min', cor:'from-pink-400 to-pink-600' },
];
const DEFAULT_DEPOIMENTOS = [
  { id:'d1', nome:'Maria Silva',     procedimento:'Abdominoplastia', texto:'A Débora foi essencial na minha recuperação! Profissional extremamente competente, atenciosa e dedicada. Meu pós-operatório foi tranquilo graças ao acompanhamento dela.', rating:5, fotoUrl:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { id:'d2', nome:'Ana Paula Costa', procedimento:'Mamoplastia',    texto:'Excelente profissional! As sessões de drenagem foram fundamentais para reduzir o inchaço rapidamente. Técnica impecável e atendimento humanizado. Super recomendo!', rating:5, fotoUrl:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id:'d3', nome:'Juliana Santos',  procedimento:'Lipoaspiração',  texto:'Fiquei impressionada com o resultado! A Débora tem mãos de fada e um conhecimento impressionante. Minha recuperação foi muito mais rápida do que eu esperava.', rating:5, fotoUrl:'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80' },
  { id:'d4', nome:'Carla Mendes',    procedimento:'Lifting Facial',  texto:'Profissional incrível! Super atenciosa, pontual e eficiente. As técnicas que ela usa realmente fazem diferença. Minha pele ficou linda e a recuperação foi perfeita.', rating:5, fotoUrl:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80' },
];
const DEFAULT_FAQS = [
  { id:'f1', pergunta:'Quando devo iniciar a fisioterapia pós-cirúrgica?',        resposta:'Geralmente entre 3 a 7 dias após a cirurgia. Quanto antes iniciar, melhores os resultados. O ideal é agendar antes mesmo da cirurgia.' },
  { id:'f2', pergunta:'Quantas sessões são necessárias?',                          resposta:'Geralmente entre 10 a 20 sessões para resultados ótimos. Faremos uma avaliação completa na primeira consulta.' },
  { id:'f3', pergunta:'A drenagem linfática dói?',                                 resposta:'Não! A técnica é suave, relaxante e indolor. Muitos pacientes adormecem durante a sessão.' },
  { id:'f4', pergunta:'Qual a diferença no resultado com fisioterapia?',           resposta:'A fisioterapia acelera em até 70% a recuperação, reduz edemas, previne complicações e potencializa o resultado estético.' },
  { id:'f5', pergunta:'Posso fazer em qualquer tipo de cirurgia plástica?',        resposta:'Sim! Atendemos abdominoplastia, lipoaspiração, mamoplastia, rinoplastia, lifting facial e muito mais.' },
  { id:'f6', pergunta:'Aceita convênios médicos?',                                 resposta:'Trabalhamos com diversos convênios. Entre em contato para verificar seu plano. Também oferecemos parcelamento.' },
];
const DEFAULT_PROCEDIMENTOS = ['Abdominoplastia','Lipoaspiração','Mamoplastia','Rinoplastia','Lifting Facial','Blefaroplastia','Lipoescultura','Prótese de Silicone','Gluteoplastia','Otoplastia'];
const DEFAULT_CONTATO = {
  telefone:'(11) 96035-4728', whatsapp:'5511960354728',
  email:'deborabueno_2@hotmail.com',
  instagram:'@debora.santiago.fisio',
  instagramUrl:'https://www.instagram.com/debora.santiago.fisio/',
  endereco:'Rua Tabapuã, 474 - conjunto 98',
  bairro:'Itaim Bibi', cidade:'São Paulo - SP', cep:'CEP: 04533-001',
  horarioSemana:'Segunda a Sexta: 8h às 18h',
  horarioSabado:'Sábado: 8h às 12h',
  mensagemWpp:'Olá! Gostaria de agendar uma avaliação de fisioterapia pós-cirúrgica.',
};

function useApi(url, fallback) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    api.get(url).then(r => { if (r.data) setData(r.data); }).catch(() => {});
  }, [url]);
  return data;
}

function useCounter(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || !target) return;
    let cur = 0;
    const step = target / 80;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, 20);
    return () => clearInterval(t);
  }, [active, target]);
  return val;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [statsOn,    setStatsOn]    = useState(false);
  const [activeTst,  setActiveTst]  = useState(0);
  const [openFaq,    setOpenFaq]    = useState(null);
  const [videoModal, setVideoModal] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', service:'', message:'' });
  const [formErr, setFormErr] = useState({});
  const statsRef = useRef(null);

  const hero     = useApi('/api/hero',         DEFAULT_HERO);
  const about    = useApi('/api/about',        DEFAULT_ABOUT);
  const servicos = useApi('/api/servicos',     DEFAULT_SERVICOS);
  const depoist  = useApi('/api/depoimentos',  DEFAULT_DEPOIMENTOS);
  const faqs     = useApi('/api/faq',          DEFAULT_FAQS);
  const contato  = useApi('/api/contato',      DEFAULT_CONTATO);
  const settings = useApi('/api/settings',     {});
  const procs    = useApi('/api/procedimentos', null);
  const blog     = useApi('/api/blog',         []);
  const insta    = useApi('/api/instagram',    []);

  const procList = procs && procs.length > 0 ? procs.filter(p => p.ativo).map(p => p.nome) : DEFAULT_PROCEDIMENTOS;
  const blogTop  = (blog  || []).filter(p => p.publicado !== false).slice(0, 3);
  const instaTop = (insta || []).slice(0, 6);
  const svcList  = servicos && servicos.length > 0 ? servicos : DEFAULT_SERVICOS;
  const tstList  = depoist  && depoist.length  > 0 ? depoist  : DEFAULT_DEPOIMENTOS;
  const faqList  = faqs     && faqs.length     > 0 ? faqs     : DEFAULT_FAQS;

  const c0 = useCounter(about?.pacientes       || 500, statsOn);
  const c1 = useCounter(about?.anosExp         || 10,  statsOn);
  const c2 = useCounter(about?.satisfacao      || 98,  statsOn);
  const c3 = useCounter(about?.especializacoes || 15,  statsOn);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 60);
      if (statsRef.current) {
        const r = statsRef.current.getBoundingClientRect();
        if (r.top < window.innerHeight - 80) setStatsOn(true);
      }
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (!tstList.length) return;
    const t = setInterval(() => setActiveTst(p => (p + 1) % tstList.length), 6000);
    return () => clearInterval(t);
  }, [tstList.length]);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    setMenuOpen(false);
  };
  const wppLink = msg => {
    const n = contato?.whatsapp || DEFAULT_CONTATO.whatsapp;
    const t = msg || contato?.mensagemWpp || DEFAULT_CONTATO.mensagemWpp;
    return `https://wa.me/${n}?text=${encodeURIComponent(t)}`;
  };
  const fmt = d => d ? new Date(d).toLocaleDateString('pt-BR',{ day:'2-digit', month:'short', year:'numeric' }) : '';

  const submitForm = e => {
    e.preventDefault();
    const err = {};
    if (!form.name?.trim())                err.name    = 'Nome obrigatório';
    if (!/\S+@\S+\.\S+/.test(form.email)) err.email   = 'Email inválido';
    if (!form.phone?.trim())               err.phone   = 'Telefone obrigatório';
    if (!form.service)                     err.service = 'Selecione um serviço';
    setFormErr(err);
    if (Object.keys(err).length) return;
    const msg = `Olá! Gostaria de um orçamento:\n👤 ${form.name}\n📧 ${form.email}\n📱 ${form.phone}\n💆 ${form.service}\n💬 ${form.message||'—'}`;
    window.open(wppLink(msg), '_blank');
    setForm({ name:'', email:'', phone:'', service:'', message:'' });
  };

  const nomeClinica = settings?.nomeClinica || 'Débora Santiago';

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family:'Inter',sans-serif; }
        h1,h2,h3,.serif { font-family:'Playfair Display',serif; }
        .gold-bar::after { content:''; display:block; width:52px; height:3px; background:linear-gradient(90deg,#D4AF7A,#8B7355); margin-top:14px; border-radius:99px; }
        .gold-bar-c::after { content:''; display:block; width:52px; height:3px; background:linear-gradient(90deg,#D4AF7A,#8B7355); margin:14px auto 0; border-radius:99px; }
        .nav-link::after { content:''; display:block; height:2px; width:0; background:#D4AF7A; transition:width .3s; border-radius:99px; }
        .nav-link:hover::after { width:100%; }
      `}</style>

      {/* NAV */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/98 backdrop-blur-xl shadow-sm border-b border-[#F5F1EB]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-20">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              <img src="/logo.png" alt="DS" className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-sm tracking-widest uppercase text-[#5D4E37]">{nomeClinica}</p>
              <p className="text-[10px] text-[#D4AF7A] font-medium tracking-wider">Fisioterapia Especializada</p>
            </div>
          </button>
          <div className="hidden lg:flex items-center gap-8">
            {[['home','Início'],['about','Sobre'],['services','Serviços'],['contact','Contato']].map(([id,label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="nav-link text-[#5D4E37] hover:text-[#D4AF7A] font-medium text-sm transition-colors">{label}</button>
            ))}
            <button onClick={() => navigate('/blog')} className="nav-link text-[#5D4E37] hover:text-[#D4AF7A] font-medium text-sm transition-colors">Blog</button>
            <button onClick={() => scrollTo('contact')} className="flex items-center gap-2 border-2 border-[#D4AF7A] text-[#8B7355] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#D4AF7A] hover:text-white transition-all duration-300">
              <Calendar className="w-4 h-4" /> Agendar
            </button>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-[#F5F1EB] text-[#5D4E37]">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-[#F5F1EB] px-5 py-4 space-y-1">
            {[['home','Início'],['about','Sobre'],['services','Serviços'],['contact','Contato']].map(([id,label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left py-3 px-4 text-[#5D4E37] hover:text-[#D4AF7A] hover:bg-[#F9F5EE] rounded-xl font-medium transition">{label}</button>
            ))}
            <button onClick={() => navigate('/blog')} className="block w-full text-left py-3 px-4 text-[#5D4E37] hover:text-[#D4AF7A] hover:bg-[#F9F5EE] rounded-xl font-medium transition">Blog</button>
            <button onClick={() => scrollTo('contact')} className="block w-full py-3 px-4 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white rounded-xl font-bold text-center mt-2">Agendar Consulta</button>
          </div>
        )}
      </nav>

      {/* HERO — split assimétrico */}
      <section id="home" className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden">
        {/* Esquerda — texto */}
        <div className="relative z-10 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 pt-32 pb-16 lg:pt-0 bg-[#F9F5EE]">
          <div className="inline-flex items-center gap-2 self-start mb-8 border border-[#D4AF7A]/50 text-[#8B7355] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#D4AF7A]" />
            {hero?.badge || DEFAULT_HERO.badge}
          </div>
          <h1 className="text-6xl sm:text-7xl xl:text-8xl font-extrabold text-[#5D4E37] leading-[.9] mb-3 gold-bar">
            {hero?.titulo || DEFAULT_HERO.titulo}
          </h1>
          <h1 className="text-6xl sm:text-7xl xl:text-8xl font-bold italic text-[#D4AF7A] leading-[.9] mb-8">
            {hero?.subtitulo || DEFAULT_HERO.subtitulo}
          </h1>
          <p className="text-base sm:text-lg text-[#666] leading-relaxed max-w-md mb-10">
            {hero?.descricao || DEFAULT_HERO.descricao}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button onClick={() => scrollTo('contact')}
              className="group flex items-center justify-center gap-3 bg-[#5D4E37] text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-[#D4AF7A] transition-all duration-300 shadow-xl shadow-[#5D4E37]/20">
              {hero?.ctaPrimario || DEFAULT_HERO.ctaPrimario}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button onClick={() => setVideoModal(true)}
              className="flex items-center justify-center gap-3 border-2 border-[#5D4E37]/20 text-[#5D4E37] px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider hover:border-[#D4AF7A] hover:text-[#D4AF7A] transition-all duration-300">
              <Play className="w-4 h-4" /> Ver Apresentação
            </button>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {['CREFITO Certificado','10+ Anos de Experiência','500+ Pacientes Atendidos'].map(t => (
              <span key={t} className="flex items-center gap-2 text-xs text-[#888] font-medium">
                <CheckCircle className="w-4 h-4 text-[#D4AF7A]" />{t}
              </span>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-4 absolute bottom-12 right-0 translate-x-1/3 bg-white p-5 rounded-3xl shadow-2xl shadow-black/10 border border-[#F5F1EB]">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-[#5D4E37] text-sm">{about?.crefito || DEFAULT_ABOUT.crefito}</p>
              <p className="text-xs text-[#999]">{about?.especialidade || DEFAULT_ABOUT.especialidade}</p>
            </div>
          </div>
        </div>
        {/* Direita — vídeo full-height */}
        <div className="relative h-72 lg:h-auto overflow-hidden cursor-pointer group" onClick={() => setVideoModal(true)}>
          <video src={hero?.videoUrl || DEFAULT_HERO.videoUrl} poster={hero?.posterUrl || DEFAULT_HERO.posterUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            muted loop playsInline autoPlay />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F9F5EE] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
              <Play className="w-9 h-9 text-[#D4AF7A] ml-1" />
            </div>
          </div>
          <div className="absolute top-8 right-8 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] p-6 rounded-3xl text-white text-center shadow-2xl">
            <p className="text-4xl font-extrabold leading-none">98%</p>
            <p className="text-xs font-semibold mt-1 opacity-90">Satisfação</p>
          </div>
        </div>
      </section>

      {/* STATS — faixa escura */}
      <div ref={statsRef} className="bg-[#5D4E37] py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { val:c0, suf:'+', label:'Pacientes Atendidos' },
              { val:c1, suf:'+', label:'Anos de Experiência' },
              { val:c2, suf:'%', label:'Satisfação' },
              { val:c3, suf:'+', label:'Especializações' },
            ].map(({ val, suf, label }, i) => (
              <div key={i} className={`text-center px-6 sm:px-10 py-6 ${i < 3 ? 'border-r border-[#8B7355]/60' : ''} ${i < 2 ? 'border-b border-[#8B7355]/60 md:border-b-0' : ''}`}>
                <p className="text-5xl sm:text-6xl font-extrabold text-[#D4AF7A] leading-none">{val}{suf}</p>
                <p className="text-[#F5F1EB]/85 text-xs uppercase tracking-widest font-semibold mt-3">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY CHOOSE — layout com borda esquerda */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#D4AF7A] text-xs font-bold uppercase tracking-widest">Por que escolher</span>
              <h2 className="text-5xl sm:text-6xl font-extrabold text-[#5D4E37] mt-4 leading-tight gold-bar">Excelência<br/>Comprovada</h2>
              <p className="text-[#666] mt-8 leading-relaxed max-w-md">Há mais de 10 anos transformando recuperações pós-cirúrgicas com protocolos avançados, tecnologia e atendimento humanizado.</p>
              <button onClick={() => scrollTo('contact')} className="mt-8 inline-flex items-center gap-3 bg-[#5D4E37] text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-[#D4AF7A] transition-all duration-300">
                Agendar Consulta <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="border border-[#F5F1EB] rounded-3xl overflow-hidden">
              {[
                { icon:Shield, title:'Segurança Garantida',    desc:'Protocolos validados e aprovados pelo CREFITO.' },
                { icon:Target, title:'Resultados Comprovados', desc:'98% de satisfação dos pacientes com resultados reais.' },
                { icon:Zap,    title:'Tecnologia Avançada',    desc:'Equipamentos de última geração para melhores resultados.' },
                { icon:Heart,  title:'Atendimento Humanizado', desc:'Cuidado personalizado em cada etapa da recuperação.' },
              ].map((item, i) => {
                const Ic = item.icon;
                return (
                  <div key={i} className={`flex items-start gap-5 p-6 sm:p-8 group hover:bg-[#F9F5EE] transition-colors border-l-4 border-transparent hover:border-[#D4AF7A] duration-200 ${i < 3 ? 'border-b border-[#F5F1EB]' : ''}`}>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition">
                      <Ic className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#5D4E37] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT — overlapping 5 colunas */}
      <section id="about" className="py-24 bg-[#F9F5EE]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-2 relative">
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-2xl shadow-[#8B7355]/20">
                <img src={about?.fotoUrl || DEFAULT_ABOUT.fotoUrl} alt={about?.nome || 'Débora Santiago'} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5D4E37]/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-bold text-xl">{about?.nome || DEFAULT_ABOUT.nome}</p>
                  <p className="text-[#D4AF7A] text-sm font-medium">{about?.especialidade || DEFAULT_ABOUT.especialidade}</p>
                </div>
              </div>
              <div className="hidden sm:block absolute -top-6 -right-6 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] text-white p-7 rounded-3xl shadow-2xl text-center z-10">
                <p className="text-5xl font-extrabold leading-none">{about?.anosExp || 10}+</p>
                <p className="text-xs font-bold uppercase tracking-wider mt-1.5 opacity-90">Anos de<br/>Experiência</p>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-8">
              <div>
                <span className="text-[#D4AF7A] text-xs font-bold uppercase tracking-widest">Conheça a Especialista</span>
                <h2 className="text-5xl sm:text-6xl font-extrabold text-[#5D4E37] mt-4 leading-tight gold-bar">{about?.nome || DEFAULT_ABOUT.nome}</h2>
                <p className="text-xs font-bold text-[#D4AF7A] uppercase tracking-widest mt-4">{about?.crefito || DEFAULT_ABOUT.crefito} · {about?.especialidade || DEFAULT_ABOUT.especialidade}</p>
              </div>
              <p className="text-[#555] leading-relaxed text-lg">{about?.descricao1 || DEFAULT_ABOUT.descricao1}</p>
              <p className="text-[#666] leading-relaxed">{about?.descricao2 || DEFAULT_ABOUT.descricao2}</p>
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#E8E0D5]">
                {[
                  { val: about?.pacientes||500,       suf:'+', label:'Pacientes' },
                  { val: about?.satisfacao||98,        suf:'%', label:'Satisfação' },
                  { val: about?.especializacoes||15,   suf:'+', label:'Certificações' },
                ].map(({ val, suf, label }, i) => (
                  <div key={i} className="text-center">
                    <p className="text-4xl font-extrabold text-[#D4AF7A]">{val}{suf}</p>
                    <p className="text-xs text-[#999] font-medium uppercase tracking-wider mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[['Formação Especializada','Certificações internacionais'],['Atendimento Personalizado','Protocolos exclusivos'],['Equipamentos Modernos','Tecnologia de ponta'],['Resultados Comprovados',`${about?.satisfacao||98}% de satisfação`]].map(([t,d],i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-[#F5F1EB]">
                    <CheckCircle className="w-5 h-5 text-[#D4AF7A] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#5D4E37] text-sm">{t}</p>
                      <p className="text-xs text-[#999] mt-0.5">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => scrollTo('contact')} className="inline-flex items-center gap-3 bg-[#5D4E37] text-white px-9 py-5 rounded-2xl font-bold uppercase text-sm tracking-wider hover:bg-[#D4AF7A] transition-all duration-300">
                Agendar Consulta <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-[#D4AF7A] text-xs font-bold uppercase tracking-widest">Tratamentos</span>
              <h2 className="text-5xl sm:text-6xl font-extrabold text-[#5D4E37] mt-4 gold-bar">Nossos Serviços</h2>
            </div>
            <button onClick={() => scrollTo('contact')} className="self-start sm:self-auto flex items-center gap-2 text-sm font-bold text-[#8B7355] hover:text-[#D4AF7A] transition whitespace-nowrap">
              Agendar agora <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {svcList.map((s, i) => (
              <div key={s.id||i} className="group relative bg-[#F9F5EE] rounded-3xl p-7 overflow-hidden hover:shadow-2xl hover:shadow-[#D4AF7A]/15 transition-all duration-500 hover:-translate-y-2 border border-[#E8E0D5] hover:border-[#D4AF7A]/50">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.cor||'from-[#D4AF7A] to-[#8B7355]'}`} />
                <div className="flex items-start justify-between mb-5">
                  <span className="text-5xl">{s.icone}</span>
                  <span className="text-xs bg-white text-[#8B7355] border border-[#E8E0D5] px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />{s.duracao}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#5D4E37] mb-3">{s.titulo}</h3>
                <p className="text-sm text-[#666] leading-relaxed mb-5">{s.descricao}</p>
                <div className="space-y-2 mb-6">
                  {(s.beneficios||[]).slice(0,4).map((b,bi) => (
                    <div key={bi} className="flex items-center gap-2 text-xs text-[#666]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF7A] flex-shrink-0" />{b}
                    </div>
                  ))}
                </div>
                <button onClick={() => scrollTo('contact')} className="w-full flex items-center justify-center gap-2 border-2 border-[#D4AF7A]/50 text-[#8B7355] py-3 rounded-2xl text-sm font-bold group-hover:bg-[#D4AF7A] group-hover:text-white group-hover:border-[#D4AF7A] transition-all duration-300">
                  Agendar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {procList.length > 0 && (
            <div className="mt-16 bg-[#5D4E37] rounded-3xl p-10 sm:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Atendemos Todos os Procedimentos</h3>
                <div className="w-16 h-0.5 bg-[#D4AF7A] mx-auto mt-4 rounded-full" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {procList.map((p,i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/20 px-4 py-3 rounded-xl border border-white/25 hover:bg-[#D4AF7A]/30 transition">
                    <CheckCircle className="w-4 h-4 text-[#D4AF7A] flex-shrink-0" />
                    <span className="text-white text-xs font-semibold">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[#F9F5EE]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-[#D4AF7A] text-xs font-bold uppercase tracking-widest">Depoimentos</span>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-[#5D4E37] mt-4 gold-bar-c">Histórias de Sucesso</h2>
          </div>
          {tstList.length > 0 && (
            <>
              <div className="relative max-w-4xl mx-auto mb-10">
                <Quote className="absolute -top-4 -left-4 w-20 h-20 text-[#D4AF7A]/15" />
                <div className="bg-white rounded-[2.5rem] p-10 sm:p-16 shadow-xl border border-[#F5F1EB]">
                  <div className="flex justify-center gap-1 mb-8">
                    {[...Array(tstList[activeTst]?.rating||5)].map((_,i) => <Star key={i} className="w-6 h-6 text-[#D4AF7A] fill-current" />)}
                  </div>
                  <p className="text-2xl sm:text-3xl font-light text-[#5D4E37] italic text-center leading-relaxed mb-10">"{tstList[activeTst]?.texto}"</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    {tstList[activeTst]?.fotoUrl && <img src={tstList[activeTst].fotoUrl} alt={tstList[activeTst].nome} className="w-16 h-16 rounded-full object-cover border-4 border-[#D4AF7A]" />}
                    <div className="text-center sm:text-left">
                      <p className="font-bold text-xl text-[#5D4E37]">{tstList[activeTst]?.nome}</p>
                      <p className="text-[#D4AF7A] font-semibold text-sm">{tstList[activeTst]?.procedimento}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mb-10">
                <button onClick={() => setActiveTst(p=>(p-1+tstList.length)%tstList.length)} className="w-10 h-10 rounded-full border-2 border-[#E8E0D5] hover:border-[#D4AF7A] flex items-center justify-center text-[#8B7355] hover:text-[#D4AF7A] transition"><ChevronLeft className="w-5 h-5" /></button>
                {tstList.map((_,i) => <button key={i} onClick={() => setActiveTst(i)} className={`rounded-full transition-all duration-500 ${i===activeTst?'w-10 h-3 bg-[#D4AF7A]':'w-3 h-3 bg-[#E8E0D5] hover:bg-[#D4AF7A]/50'}`} />)}
                <button onClick={() => setActiveTst(p=>(p+1)%tstList.length)} className="w-10 h-10 rounded-full border-2 border-[#E8E0D5] hover:border-[#D4AF7A] flex items-center justify-center text-[#8B7355] hover:text-[#D4AF7A] transition"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tstList.slice(0,4).map((t,i) => (
                  <button key={i} onClick={() => setActiveTst(i)} className={`p-5 rounded-2xl text-left transition-all border-2 ${i===activeTst?'bg-white border-[#D4AF7A]/50 shadow-lg':'bg-white border-[#F5F1EB] hover:border-[#D4AF7A]/30'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      {t.fotoUrl && <img src={t.fotoUrl} alt={t.nome} className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF7A]" />}
                      <div>
                        <p className="font-bold text-[#5D4E37] text-sm">{t.nome}</p>
                        <p className="text-xs text-[#D4AF7A]">{t.procedimento}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#666] line-clamp-2 italic">"{t.texto}"</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* INSTAGRAM */}
      {instaTop.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[#D4AF7A] text-xs font-bold uppercase tracking-widest">Redes Sociais</span>
                <h2 className="text-5xl font-extrabold text-[#5D4E37] mt-4 gold-bar">No Instagram</h2>
              </div>
              <a href={contato?.instagramUrl||DEFAULT_CONTATO.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:shadow-lg transition">
                <Instagram className="w-4 h-4" />{contato?.instagram||DEFAULT_CONTATO.instagram}
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {instaTop.map((item,i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="relative group aspect-square overflow-hidden rounded-2xl">
                  {item.tipo==='video'
                    ? <video src={item.mediaUrl} poster={item.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" muted loop playsInline preload="metadata" onMouseEnter={e=>e.target.play()} onMouseLeave={e=>{e.target.pause();e.target.currentTime=0;}} />
                    : <img src={item.mediaUrl} alt={item.legenda} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  }
                  <div className="absolute inset-0 bg-[#5D4E37]/0 group-hover:bg-[#5D4E37]/50 flex items-center justify-center transition-all duration-500">
                    <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLOG */}
      {blogTop.length > 0 && (
        <section className="py-24 bg-[#F9F5EE]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-6">
              <div>
                <span className="text-[#D4AF7A] text-xs font-bold uppercase tracking-widest">Conteúdo</span>
                <h2 className="text-5xl font-extrabold text-[#5D4E37] mt-4 gold-bar">Blog & Dicas</h2>
              </div>
              <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-sm font-bold text-[#8B7355] hover:text-[#D4AF7A] transition">Ver todos <ArrowUpRight className="w-4 h-4" /></button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogTop.map((post,i) => (
                <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {post.imagemUrl && (
                    <div className="relative h-52 overflow-hidden">
                      <img src={post.imagemUrl} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#5D4E37]">{post.readTime}</div>
                    </div>
                  )}
                  <div className="p-7">
                    <p className="text-xs text-[#D4AF7A] font-bold uppercase tracking-wider mb-3">{fmt(post.createdAt)}</p>
                    <h3 className="text-lg font-bold text-[#5D4E37] mb-3 group-hover:text-[#D4AF7A] transition line-clamp-2">{post.titulo}</h3>
                    <p className="text-sm text-[#666] leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                    <button onClick={() => navigate(`/blog/${post.slug}`)} className="flex items-center gap-2 text-[#D4AF7A] font-bold text-sm group-hover:gap-4 transition-all">
                      Ler artigo <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqList.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-14">
              <span className="text-[#D4AF7A] text-xs font-bold uppercase tracking-widest">Dúvidas</span>
              <h2 className="text-5xl font-extrabold text-[#5D4E37] mt-4 gold-bar-c">Perguntas Frequentes</h2>
            </div>
            <div className="space-y-3">
              {faqList.map((item,i) => (
                <div key={i} className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${openFaq===i?'border-[#D4AF7A]/50 shadow-md':'border-[#F5F1EB]'}`}>
                  <button onClick={() => setOpenFaq(openFaq===i?null:i)} className="w-full flex items-center gap-5 p-6 text-left bg-white hover:bg-[#F9F5EE] transition">
                    <span className="text-3xl font-extrabold text-[#D4AF7A]/50 font-serif w-8 flex-shrink-0 leading-none">{String(i+1).padStart(2,'0')}</span>
                    <span className="flex-1 font-bold text-[#5D4E37] text-sm sm:text-base">{item.pergunta}</span>
                    <ChevronDown className={`w-5 h-5 text-[#D4AF7A] flex-shrink-0 transition-transform duration-300 ${openFaq===i?'rotate-180':''}`} />
                  </button>
                  {openFaq===i && (
                    <div className="px-6 pb-6 bg-[#F9F5EE] pl-20">
                      <p className="text-[#666] leading-relaxed text-sm sm:text-base">{item.resposta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT — split screen */}
      <section id="contact" className="py-24 bg-[#F9F5EE]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-[#D4AF7A] text-xs font-bold uppercase tracking-widest">Fale Conosco</span>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-[#5D4E37] mt-4 gold-bar-c">Agende sua Avaliação</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Painel escuro */}
            <div className="bg-[#5D4E37] rounded-3xl p-8 sm:p-10 text-white space-y-5">
              <div>
                <h3 className="text-2xl font-bold mb-1">Informações de Contato</h3>
                <div className="w-12 h-0.5 bg-[#D4AF7A] rounded-full mt-3" />
              </div>
              {[
                { icon:Phone, label:'Telefone / WhatsApp', val:contato?.telefone||DEFAULT_CONTATO.telefone,  href:`tel:+${contato?.whatsapp||DEFAULT_CONTATO.whatsapp}` },
                { icon:Mail,  label:'Email',               val:contato?.email||DEFAULT_CONTATO.email,        href:`mailto:${contato?.email||DEFAULT_CONTATO.email}` },
                { icon:MapPin,label:'Localização',         val:`${contato?.endereco||DEFAULT_CONTATO.endereco}\n${contato?.bairro||DEFAULT_CONTATO.bairro}, ${contato?.cidade||DEFAULT_CONTATO.cidade}\n${contato?.cep||DEFAULT_CONTATO.cep}` },
                { icon:Clock, label:'Horários',            val:`${contato?.horarioSemana||DEFAULT_CONTATO.horarioSemana}\n${contato?.horarioSabado||DEFAULT_CONTATO.horarioSabado}` },
              ].map((item, i) => {
                const ContactIcon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-5 p-5 bg-white/15 rounded-2xl border border-white/10 hover:bg-white/20 transition">
                    <div className="w-12 h-12 bg-[#D4AF7A]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ContactIcon className="w-5 h-5 text-[#D4AF7A]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#D4AF7A] mb-1">{item.label}</p>
                      {item.href
                        ? <a href={item.href} className="text-white/80 hover:text-white text-sm font-medium transition">{item.val}</a>
                        : <p className="text-white/80 text-sm whitespace-pre-line">{item.val}</p>
                      }
                    </div>
                  </div>
                );
              })}
              <a href={contato?.instagramUrl||DEFAULT_CONTATO.instagramUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-2xl border border-pink-400/20 hover:from-pink-500/40 hover:to-purple-600/40 transition">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-pink-300 mb-1">Instagram</p>
                  <p className="text-white/80 text-sm">{contato?.instagram||DEFAULT_CONTATO.instagram}</p>
                </div>
              </a>
            </div>
            {/* Formulário */}
            <form onSubmit={submitForm} className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#F5F1EB] space-y-5">
              <h3 className="text-2xl font-bold text-[#5D4E37]">Solicite seu Orçamento</h3>
              {[{name:'name',type:'text',ph:'Seu nome completo'},{name:'email',type:'email',ph:'Seu melhor email'},{name:'phone',type:'tel',ph:'(11) 99999-9999'}].map(({name,type,ph}) => (
                <div key={name}>
                  <input type={type} name={name} placeholder={ph} value={form[name]}
                    onChange={e=>{setForm(f=>({...f,[name]:e.target.value}));if(formErr[name])setFormErr(f=>({...f,[name]:''}));}}
                    className={`w-full px-5 py-4 bg-[#F9F5EE] rounded-xl border-2 focus:outline-none focus:border-[#D4AF7A] focus:bg-white transition text-[#333] placeholder-[#aaa] ${formErr[name]?'border-red-400':'border-transparent'}`} />
                  {formErr[name] && <p className="text-red-400 text-xs mt-1">{formErr[name]}</p>}
                </div>
              ))}
              <div>
                <select name="service" value={form.service}
                  onChange={e=>{setForm(f=>({...f,service:e.target.value}));if(formErr.service)setFormErr(f=>({...f,service:''}));}}
                  className={`w-full px-5 py-4 bg-[#F9F5EE] rounded-xl border-2 focus:outline-none focus:border-[#D4AF7A] focus:bg-white transition text-[#333] ${formErr.service?'border-red-400':'border-transparent'}`}>
                  <option value="">Selecione o serviço desejado</option>
                  {svcList.map((s,i) => <option key={i} value={s.titulo}>{s.titulo}</option>)}
                </select>
                {formErr.service && <p className="text-red-400 text-xs mt-1">{formErr.service}</p>}
              </div>
              <textarea name="message" value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} rows={4}
                placeholder="Conte sobre sua cirurgia e expectativas (opcional)"
                className="w-full px-5 py-4 bg-[#F9F5EE] rounded-xl border-2 border-transparent focus:outline-none focus:border-[#D4AF7A] focus:bg-white transition resize-none text-[#333] placeholder-[#aaa]" />
              <button type="submit" className="w-full bg-[#5D4E37] text-white py-5 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#D4AF7A] transition-all duration-300 flex items-center justify-center gap-3">
                <Send className="w-5 h-5" /> Enviar via WhatsApp
              </button>
              <p className="text-center text-xs text-[#999]">Você será redirecionado ao WhatsApp para finalizar.</p>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#5D4E37] text-white py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#8B7355]/50">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl">
                  <img src="/logo.png" alt="DS" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-extrabold text-[#D4AF7A] tracking-widest uppercase text-sm">{nomeClinica}</p>
                  <p className="text-xs text-white/50">Fisioterapia Especializada</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
                Fisioterapia especializada em pós-operatório de cirurgias plásticas. Transformando recuperações há mais de 10 anos em São Paulo.
              </p>
              <p className="text-xs text-[#D4AF7A] font-bold uppercase tracking-wider mb-4">
                {about?.crefito||DEFAULT_ABOUT.crefito} · {about?.especialidade||DEFAULT_ABOUT.especialidade}
              </p>
              <div className="flex gap-3">
                <a href={contato?.instagramUrl||DEFAULT_CONTATO.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 transition shadow-lg">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href={wppLink()} target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center hover:scale-110 transition shadow-lg hover:bg-green-700">
                  <Phone className="w-5 h-5 text-white" />
                </a>
                <a href={`mailto:${contato?.email||DEFAULT_CONTATO.email}`}
                  className="w-11 h-11 bg-[#8B7355] rounded-xl flex items-center justify-center hover:scale-110 transition shadow-lg hover:bg-[#D4AF7A]">
                  <Mail className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-[#D4AF7A] font-bold text-xs uppercase tracking-widest mb-5">Links Rápidos</h4>
              <ul className="space-y-3">
                {[['home','Início'],['about','Sobre'],['services','Serviços'],['contact','Contato']].map(([id,label]) => (
                  <li key={id}><button onClick={() => scrollTo(id)} className="text-white/60 hover:text-[#D4AF7A] text-sm transition-colors">→ {label}</button></li>
                ))}
                <li><button onClick={() => navigate('/blog')} className="text-white/60 hover:text-[#D4AF7A] text-sm transition-colors">→ Blog</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#D4AF7A] font-bold text-xs uppercase tracking-widest mb-5">Contato</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li className="flex gap-3 items-start"><Phone className="w-4 h-4 text-[#D4AF7A] flex-shrink-0 mt-0.5" /><span>{contato?.telefone||DEFAULT_CONTATO.telefone}</span></li>
                <li className="flex gap-3 items-start"><Mail className="w-4 h-4 text-[#D4AF7A] flex-shrink-0 mt-0.5" /><span className="break-all">{contato?.email||DEFAULT_CONTATO.email}</span></li>
                <li className="flex gap-3 items-start"><MapPin className="w-4 h-4 text-[#D4AF7A] flex-shrink-0 mt-0.5" /><span>{contato?.endereco||DEFAULT_CONTATO.endereco}<br/>{contato?.bairro||DEFAULT_CONTATO.bairro}<br/>{contato?.cidade||DEFAULT_CONTATO.cidade}</span></li>
                <li className="flex gap-3 items-start"><Clock className="w-4 h-4 text-[#D4AF7A] flex-shrink-0 mt-0.5" /><span>{contato?.horarioSemana||DEFAULT_CONTATO.horarioSemana}<br/>{contato?.horarioSabado||DEFAULT_CONTATO.horarioSabado}</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p className="text-white/60">© {new Date().getFullYear()} {nomeClinica}. Todos os direitos reservados.</p>
            <p className="text-white/50">Dev by DevAlex-FullStack</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      {(settings?.whatsappFloat !== false) && (
        <a href={wppLink(settings?.whatsappMsg)} target="_blank" rel="noopener noreferrer" className="fixed bottom-7 right-7 z-50 group" aria-label="WhatsApp">
          <div className="relative">
            <div className="absolute inset-0 bg-[#25D366] rounded-full blur-xl opacity-40 animate-pulse" />
            <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition group-hover:scale-110 duration-300">
              <MessageCircle className="w-7 h-7" />
            </div>
          </div>
          <div className="hidden lg:block absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#5D4E37] text-white px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow-xl pointer-events-none">
            💬 Tire suas dúvidas agora!
          </div>
        </a>
      )}

      {/* Video Modal */}
      {videoModal && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4" onClick={() => setVideoModal(false)}>
          <div className="relative max-w-4xl w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setVideoModal(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition z-10">
              <X className="w-5 h-5 text-white" />
            </button>
            <video src={hero?.videoUrl||DEFAULT_HERO.videoUrl} poster={hero?.posterUrl||DEFAULT_HERO.posterUrl} className="w-full h-full object-cover" controls autoPlay />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;