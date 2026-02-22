import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Instagram, Clock, Award, Users, Heart, ChevronRight, Menu, X, CheckCircle, Star, Sparkles, TrendingUp, Shield, Zap, Target, ArrowRight, Play, Calendar, MessageCircle, Send } from 'lucide-react';

const FisioterapiaDeboraSantiago = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: '', message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  const statsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 50);

      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && !statsVisible) {
          setStatsVisible(true);
          animateNumbers();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [statsVisible]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService(prev => (prev + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const animateNumbers = () => {
    const targets = [500, 10, 98, 15];
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    targets.forEach((target, index) => {
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = target;
            return newStats;
          });
          clearInterval(timer);
        } else {
          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = Math.floor(current);
            return newStats;
          });
        }
      }, stepDuration);
    });
  };

  const services = [
    {
      title: "Drenagem Linfática",
      description: "Técnica especializada que utiliza movimentos suaves e rítmicos para reduzir edemas, acelerar a recuperação e eliminar toxinas do organismo.",
      icon: "💆‍♀️",
      benefits: ["Reduz inchaço em até 70%", "Acelera cicatrização", "Melhora circulação", "Desintoxica o organismo"],
      duration: "60 min",
      price: "Consulte",
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "Ultrassom Terapêutico",
      description: "Tecnologia de ponta que utiliza ondas sonoras para regeneração tecidual profunda, alívio de dores e aceleração da cicatrização.",
      icon: "🔊",
      benefits: ["Regeneração profunda", "Tratamento indolor", "Resultados rápidos", "Recuperação acelerada"],
      duration: "45 min",
      price: "Consulte",
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Radiofrequência",
      description: "Tecnologia avançada que estimula a produção de colágeno, promove firmeza da pele e melhora significativamente a circulação local.",
      icon: "⚡",
      benefits: ["Firmeza da pele", "Estimula colágeno", "Efeito lifting", "Rejuvenescimento"],
      duration: "50 min",
      price: "Consulte",
      color: "from-orange-400 to-orange-600"
    },
    {
      title: "Mobilização Cicatricial",
      description: "Técnicas manuais especializadas para melhorar qualidade, flexibilidade e aparência de cicatrizes, prevenindo aderências.",
      icon: "✋",
      benefits: ["Cicatrizes suaves", "Maior mobilidade", "Menos aderências", "Melhora estética"],
      duration: "40 min",
      price: "Consulte",
      color: "from-green-400 to-green-600"
    },
    {
      title: "Exercícios Terapêuticos",
      description: "Programa personalizado de exercícios para fortalecimento muscular, ganho de mobilidade e recuperação funcional completa.",
      icon: "💪",
      benefits: ["Fortalecimento", "Prevenção", "Autonomia", "Resultados duradouros"],
      duration: "55 min",
      price: "Consulte",
      color: "from-red-400 to-red-600"
    },
    {
      title: "Orientações Pós-Operatórias",
      description: "Acompanhamento completo e individualizado com orientações detalhadas para uma recuperação segura, rápida e sem complicações.",
      icon: "📋",
      benefits: ["Recuperação segura", "Suporte 24/7", "Melhores resultados", "Tranquilidade total"],
      duration: "30 min",
      price: "Consulte",
      color: "from-pink-400 to-pink-600"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      procedure: "Abdominoplastia",
      text: "A Débora foi essencial na minha recuperação! Profissional extremamente competente, atenciosa e dedicada. Meu pós-operatório foi tranquilo graças ao acompanhamento dela. Recomendo de olhos fechados!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
    },
    {
      name: "Ana Paula Costa",
      procedure: "Mamoplastia",
      text: "Excelente profissional! As sessões de drenagem foram fundamentais para reduzir o inchaço rapidamente. Técnica impecável e atendimento humanizado. Super recomendo o trabalho da Débora!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
    },
    {
      name: "Juliana Santos",
      procedure: "Lipoaspiração",
      text: "Fiquei impressionada com o resultado! A Débora tem mãos de fada e um conhecimento impressionante. Minha recuperação foi muito mais rápida do que eu esperava. Profissional nota 1000!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80"
    },
    {
      name: "Carla Mendes",
      procedure: "Lifting Facial",
      text: "Profissional incrível! Super atenciosa, pontual e eficiente. As técnicas que ela usa realmente fazem diferença. Minha pele ficou linda e a recuperação foi perfeita. Gratidão eterna!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80"
    }
  ];

  const stats = [
    { number: 500, suffix: "+", label: "Pacientes Atendidos", icon: Users },
    { number: 10, suffix: "+", label: "Anos de Experiência", icon: Award },
    { number: 98, suffix: "%", label: "Satisfação", icon: Star },
    { number: 15, suffix: "+", label: "Especializações", icon: TrendingUp }
  ];

  const whyChoose = [
    {
      icon: Shield,
      title: "Segurança Garantida",
      description: "Protocolos validados cientificamente e aprovados pelo CREFITO"
    },
    {
      icon: Target,
      title: "Resultados Comprovados",
      description: "98% de satisfação dos pacientes e resultados visíveis"
    },
    {
      icon: Zap,
      title: "Tecnologia Avançada",
      description: "Equipamentos de última geração para melhores resultados"
    },
    {
      icon: Heart,
      title: "Atendimento Humanizado",
      description: "Cuidado personalizado em cada etapa da sua recuperação"
    }
  ];

  const procedures = [
    "Abdominoplastia",
    "Lipoaspiração",
    "Mamoplastia",
    "Rinoplastia",
    "Lifting Facial",
    "Blefaroplastia",
    "Lipoescultura",
    "Prótese de Silicone"
  ];

  const blogPosts = [
    {
      title: "5 Dicas Essenciais para Recuperação Pós-Cirúrgica",
      excerpt: "Descubra as melhores práticas para uma recuperação rápida e segura após sua cirurgia plástica.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&q=80",
      date: "15 Mar 2024",
      readTime: "5 min"
    },
    {
      title: "Drenagem Linfática: Como Funciona e Benefícios",
      excerpt: "Entenda como a drenagem linfática pode acelerar sua recuperação e reduzir edemas.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
      date: "10 Mar 2024",
      readTime: "7 min"
    },
    {
      title: "Quando Iniciar a Fisioterapia Pós-Operatória",
      excerpt: "Saiba o momento ideal para começar seu tratamento fisioterapêutico.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
      date: "05 Mar 2024",
      readTime: "4 min"
    }
  ];

  const faq = [
    {
      question: "Quando devo iniciar a fisioterapia pós-cirúrgica?",
      answer: "Geralmente entre 3 a 7 dias após a cirurgia, dependendo da orientação do seu cirurgião. Quanto antes iniciar, melhor será a recuperação e mais rápidos os resultados. O ideal é já agendar antes mesmo da cirurgia."
    },
    {
      question: "Quantas sessões são necessárias?",
      answer: "O número varia conforme o procedimento e resposta individual, mas geralmente são recomendadas entre 10 a 20 sessões para resultados ótimos e duradouros. Faremos uma avaliação completa na primeira consulta."
    },
    {
      question: "A drenagem linfática dói?",
      answer: "Não! A técnica é suave, relaxante e indolor. Muitos pacientes relatam sensação de bem-estar e até adormecem durante a sessão devido ao relaxamento profundo proporcionado pela técnica."
    },
    {
      question: "Qual a diferença no resultado com fisioterapia?",
      answer: "A fisioterapia acelera em até 70% a recuperação, reduz edemas e hematomas, previne complicações, melhora significativamente a cicatrização e potencializa o resultado estético final da cirurgia."
    },
    {
      question: "Posso fazer fisioterapia em qualquer tipo de cirurgia plástica?",
      answer: "Sim! A fisioterapia é indicada para praticamente todos os procedimentos: abdominoplastia, lipoaspiração, mamoplastia, rinoplastia, lifting facial, blefaroplastia e muitos outros. Cada tratamento é personalizado."
    },
    {
      question: "Aceita convênios médicos?",
      answer: "Trabalhamos com diversos convênios. Entre em contato para verificar se o seu plano está incluso. Também oferecemos opções de pagamento facilitado para tratamentos particulares."
    }
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    if (!formData.phone || !/^\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Telefone inválido';
    }
    if (!formData.service) {
      errors.service = 'Selecione um serviço';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const serviceNames = {
      'drenagem': 'Drenagem Linfática',
      'ultrassom': 'Ultrassom Terapêutico',
      'radiofrequencia': 'Radiofrequência',
      'mobilizacao': 'Mobilização Cicatricial',
      'exercicios': 'Exercícios Terapêuticos',
      'orientacoes': 'Orientações Pós-Operatórias'
    };

    const message = `Olá! Gostaria de solicitar um orçamento:

📋 *DADOS:*
- Nome: ${formData.name}
- Email: ${formData.email}
- Telefone: ${formData.phone}
- Serviço: ${serviceNames[formData.service] || formData.service}

💬 *Mensagem:*
${formData.message || 'Não informado'}

Aguardo o contato!`;

    const whatsappUrl = `https://wa.me/5511960354728?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700&display=swap');
        
        * { font-family: 'Open Sans', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        .animate-slide-in { animation: slideIn 0.8s ease-out; }
      `}</style>

      {/* ✅ NAVIGATION - 100% RESPONSIVO */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-2xl' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo Responsivo */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center shadow-lg animate-pulse-slow">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-sm sm:text-lg md:text-xl font-bold text-[#5D4E37] tracking-wider">DEBORA SANTIAGO</span>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="text-[#333] hover:text-[#D4AF7A] transition font-medium relative group">
                Início
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF7A] group-hover:w-full transition-all"></span>
              </button>
              <button onClick={() => scrollToSection('about')} className="text-[#333] hover:text-[#D4AF7A] transition font-medium relative group">
                Sobre
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF7A] group-hover:w-full transition-all"></span>
              </button>
              <button onClick={() => scrollToSection('services')} className="text-[#333] hover:text-[#D4AF7A] transition font-medium relative group">
                Serviços
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF7A] group-hover:w-full transition-all"></span>
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-[#333] hover:text-[#D4AF7A] transition font-medium relative group">
                Depoimentos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF7A] group-hover:w-full transition-all"></span>
              </button>
              <button onClick={() => scrollToSection('blog')} className="text-[#333] hover:text-[#D4AF7A] transition font-medium relative group">
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF7A] group-hover:w-full transition-all"></span>
              </button>
              {/* CTA Button Responsivo */}
              <button onClick={() => scrollToSection('contact')} className="bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-5 py-2.5 rounded-full hover:shadow-2xl transition transform hover:-translate-y-1 font-semibold text-xs uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Agendar
              </button>
            </div>

            {/* Hamburger Menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-[#5D4E37] p-2">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-[#F5F1EB] animate-slide-in">
            <div className="px-4 py-4 space-y-1">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-3 px-4 text-[#333] hover:text-[#D4AF7A] hover:bg-[#F5F1EB] rounded-lg transition-all">Início</button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-3 px-4 text-[#333] hover:text-[#D4AF7A] hover:bg-[#F5F1EB] rounded-lg transition-all">Sobre</button>
              <button onClick={() => scrollToSection('services')} className="block w-full text-left py-3 px-4 text-[#333] hover:text-[#D4AF7A] hover:bg-[#F5F1EB] rounded-lg transition-all">Serviços</button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left py-3 px-4 text-[#333] hover:text-[#D4AF7A] hover:bg-[#F5F1EB] rounded-lg transition-all">Depoimentos</button>
              <button onClick={() => scrollToSection('blog')} className="block w-full text-left py-3 px-4 text-[#333] hover:text-[#D4AF7A] hover:bg-[#F5F1EB] rounded-lg transition-all">Blog</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-3 px-4 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white rounded-lg font-semibold hover:shadow-lg transition-all mt-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Agendar Consulta
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ✅ HERO SECTION - 100% RESPONSIVO */}
      <section id="home" className="pt-16 sm:pt-20 min-h-screen bg-gradient-to-br from-[#F5F1EB] via-white to-[#F5F1EB] flex items-center relative overflow-hidden">
        {/* Elementos flutuantes decorativos */}
        <div className="absolute top-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-[#D4AF7A]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-[#8B7355]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

            {/* Conteúdo Text - Responsivo */}
            <div className="space-y-6 sm:space-y-8 animate-slide-in order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A]/20 to-[#8B7355]/20 text-[#5D4E37] px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold border-2 border-[#D4AF7A]/30 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Especialista em Pós-Operatório
              </div>

              {/* Título Principal - Responsivo */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#5D4E37] leading-tight">
                Recuperação<br />
                <span className="bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] bg-clip-text text-transparent">Extraordinária</span>
              </h1>

              {/* Subtítulo - Responsivo */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#666] leading-relaxed">
                Fisioterapia especializada que transforma sua recuperação pós-cirúrgica em uma experiência <span className="text-[#D4AF7A] font-semibold">rápida, segura e confortável</span>.
              </p>

              {/* Botões CTA - Responsivo */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <button onClick={() => scrollToSection('contact')} className="group bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-full font-bold hover:shadow-2xl transition transform hover:-translate-y-2 flex items-center justify-center gap-2 sm:gap-3 uppercase text-xs sm:text-sm tracking-wider">
                  <span className="hidden sm:inline">Agendar Avaliação Gratuita</span>
                  <span className="sm:hidden">Avaliação Gratuita</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition" />
                </button>
                <button onClick={() => scrollToSection('services')} className="border-2 border-[#D4AF7A] text-[#8B7355] px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-full font-bold hover:bg-[#F5F1EB] transition transform hover:-translate-y-2 uppercase text-xs sm:text-sm tracking-wider text-center">
                  <span className="hidden sm:inline">Conhecer Tratamentos</span>
                  <span className="sm:hidden">Ver Tratamentos</span>
                </button>
              </div>

              {/* Trust Badges - Responsivo */}
              <div className="flex flex-wrap gap-4 sm:gap-6 pt-4 sm:pt-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#666]">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF7A]" />
                  <span>CREFITO Certificado</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#666]">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF7A]" />
                  <span>10+ Anos</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#666]">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF7A]" />
                  <span>500+ Pacientes</span>
                </div>
              </div>
            </div>

            {/* Imagem/Vídeo Hero - Responsivo */}
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[3rem] overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
                <video
                  src="/videos/apresentacao.mp4"
                  poster="/images/foto-sobre.png"
                  className="w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[700px] object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5D4E37]/60 via-transparent to-transparent"></div>

                {/* Play Button Overlay */}
                <button
                  onClick={() => setVideoPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition shadow-2xl">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#D4AF7A] ml-1" />
                  </div>
                </button>
              </div>

              {/* Floating Card - Esconder em mobile */}
              <div className="hidden lg:block absolute -bottom-6 -left-6 xl:-bottom-8 xl:-left-8 bg-white p-6 xl:p-8 rounded-2xl xl:rounded-3xl shadow-2xl border-4 border-[#F5F1EB] animate-float">
                <div className="flex items-center gap-3 xl:gap-4">
                  <div className="w-12 h-12 xl:w-16 xl:h-16 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 xl:w-8 xl:h-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#5D4E37] text-base xl:text-xl">Certificada CREFITO-3</div>
                    <div className="text-xs xl:text-sm text-[#666]">Especialista Dermato-Funcional</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ STATS SECTION - 100% RESPONSIVO */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20 lg:mt-24">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-[#F5F1EB]">
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#D4AF7A] mx-auto mb-3 sm:mb-4" />
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#D4AF7A] mb-1 sm:mb-2">
                  {statsVisible ? animatedStats[idx] : 0}{stat.suffix}
                </div>
                <div className="text-xs sm:text-sm text-[#666] font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ WHY CHOOSE SECTION - 100% RESPONSIVO */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título Section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="text-[#D4AF7A] font-semibold text-xs sm:text-sm uppercase tracking-wider">Por Que Escolher</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#5D4E37] mt-3 sm:mt-4 mb-4 sm:mb-6">Excelência Comprovada</h2>
            <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] mx-auto rounded-full"></div>
          </div>

          {/* Grid Cards - Responsivo */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyChoose.map((item, idx) => (
              <div key={idx} className="group p-6 sm:p-8 bg-gradient-to-br from-[#F5F1EB] to-white rounded-2xl sm:rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-[#D4AF7A]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition shadow-lg">
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#5D4E37] mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-[#666] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ ABOUT SECTION - 100% RESPONSIVO */}
      <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

            {/* Imagem - Responsivo */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="/images/foto-sobre.png"
                  alt="Débora Santiago"
                  className="w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5D4E37]/50 to-transparent"></div>
              </div>

              {/* Floating Cards - Esconder em mobile/tablet */}
              <div className="hidden md:block absolute -top-6 -right-6 lg:-top-8 lg:-right-8 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] text-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-2xl animate-pulse-slow">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2">10+</div>
                <div className="text-xs sm:text-sm uppercase tracking-wider font-semibold">Anos de<br />Experiência</div>
              </div>

              <div className="hidden md:block absolute -bottom-6 -left-6 lg:-bottom-8 lg:-left-8 bg-white p-6 sm:p-8 rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-[#F5F1EB]">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex -space-x-2 sm:-space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white bg-gradient-to-br from-[#D4AF7A] to-[#8B7355]"></div>
                    ))}
                  </div>
                  <div>
                    <div className="font-bold text-[#5D4E37] text-sm sm:text-base">500+</div>
                    <div className="text-xs sm:text-sm text-[#666]">Pacientes Felizes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo Text - Responsivo */}
            <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
              <div>
                <span className="text-[#D4AF7A] font-semibold text-xs sm:text-sm uppercase tracking-wider">Conheça a Especialista</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#5D4E37] mt-3 sm:mt-4 mb-4 sm:mb-6">Débora Santiago</h2>
                <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] rounded-full"></div>
              </div>

              <p className="text-lg sm:text-xl text-[#666] leading-relaxed">
                Sou fisioterapeuta especializada em pós-operatório de cirurgias plásticas, com mais de 10 anos de experiência e formação avançada em drenagem linfática e técnicas de reabilitação dermato-funcional.
              </p>

              <p className="text-base sm:text-lg text-[#666] leading-relaxed">
                Minha missão é proporcionar uma recuperação segura, rápida e confortável, potencializando os resultados da sua cirurgia através de protocolos personalizados e atendimento humanizado.
              </p>

              {/* Grid Features - Responsivo */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6">
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF7A] flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-[#5D4E37] mb-1 text-sm sm:text-base">Formação Especializada</div>
                    <div className="text-xs sm:text-sm text-[#666]">Cursos avançados e certificações internacionais</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF7A] flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-[#5D4E37] mb-1 text-sm sm:text-base">Atendimento Personalizado</div>
                    <div className="text-xs sm:text-sm text-[#666]">Protocolos exclusivos para cada paciente</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF7A] flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-[#5D4E37] mb-1 text-sm sm:text-base">Equipamentos Modernos</div>
                    <div className="text-xs sm:text-sm text-[#666]">Tecnologia de última geração</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF7A] flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-[#5D4E37] mb-1 text-sm sm:text-base">Resultados Comprovados</div>
                    <div className="text-xs sm:text-sm text-[#666]">98% de satisfação dos pacientes</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button onClick={() => scrollToSection('contact')} className="bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold hover:shadow-2xl transition transform hover:-translate-y-1 uppercase text-xs sm:text-sm tracking-wider inline-flex items-center gap-2 mt-4 sm:mt-6">
                Agendar Consulta
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ SERVICES SECTION - 100% RESPONSIVO */}
      <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título Section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="text-[#D4AF7A] font-semibold text-xs sm:text-sm uppercase tracking-wider">Tratamentos Especializados</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#5D4E37] mt-3 sm:mt-4 mb-4 sm:mb-6">Nossos Serviços</h2>
            <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] mx-auto rounded-full mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl text-[#666] max-w-3xl mx-auto">
              Tratamentos personalizados com tecnologia de ponta para sua recuperação
            </p>
          </div>

          {/* Grid Services - Responsivo */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className={`group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-[#F5F1EB] hover:border-[#D4AF7A] overflow-hidden ${activeService === idx ? 'ring-4 ring-[#D4AF7A] ring-offset-4' : ''}`}
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${service.color}`}></div>

                {/* Ícone - Responsivo */}
                <div className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 group-hover:scale-110 transition duration-500">{service.icon}</div>

                {/* Título - Responsivo */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#5D4E37] mb-3 sm:mb-4">{service.title}</h3>

                {/* Descrição - Responsivo */}
                <p className="text-sm sm:text-base text-[#666] mb-4 sm:mb-6 leading-relaxed">{service.description}</p>

                {/* Benefícios - Responsivo */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {service.benefits.map((benefit, bidx) => (
                    <div key={bidx} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#666]">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF7A] flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Card - Responsivo */}
                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t-2 border-[#F5F1EB]">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#666]">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="text-[#D4AF7A] font-bold text-base sm:text-lg">{service.price}</div>
                </div>

                {/* CTA Button - Responsivo */}
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-3 sm:py-4 rounded-xl font-semibold hover:shadow-xl transition transform hover:-translate-y-1 uppercase text-xs sm:text-sm tracking-wider"
                >
                  Agendar Agora
                </button>
              </div>
            ))}
          </div>

          {/* Procedures List - Responsivo */}
          <div className="mt-12 sm:mt-16 md:mt-20 bg-gradient-to-br from-[#F5F1EB] to-white p-8 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#5D4E37] mb-6 sm:mb-8 text-center">Atendemos Todos os Procedimentos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {procedures.map((proc, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF7A] flex-shrink-0" />
                  <span className="text-[#5D4E37] font-medium text-sm sm:text-base">{proc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ TESTIMONIALS SECTION - 100% RESPONSIVO */}
      <section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#F5F1EB] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título Section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="text-[#D4AF7A] font-semibold text-xs sm:text-sm uppercase tracking-wider">Depoimentos Reais</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#5D4E37] mt-3 sm:mt-4 mb-4 sm:mb-6">Histórias de Sucesso</h2>
            <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] mx-auto rounded-full mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl text-[#666]">Veja o que nossos pacientes dizem sobre a experiência</p>
          </div>

          {/* Card Depoimento - Responsivo */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-[3rem] p-8 sm:p-10 md:p-12 lg:p-16 shadow-2xl border-2 sm:border-4 border-[#F5F1EB] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-[#D4AF7A]/5 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                {/* Estrelas - Responsivo */}
                <div className="flex justify-center mb-6 sm:mb-8 gap-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#D4AF7A] fill-current" />
                  ))}
                </div>

                {/* Texto Depoimento - Responsivo */}
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#5D4E37] italic text-center mb-8 sm:mb-10 leading-relaxed font-light px-2">
                  "{testimonials[currentTestimonial].text}"
                </p>

                {/* Autor - Responsivo */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-[#D4AF7A] shadow-lg"
                  />
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-xl sm:text-2xl text-[#5D4E37]">{testimonials[currentTestimonial].name}</div>
                    <div className="text-[#D4AF7A] font-medium text-base sm:text-lg">{testimonials[currentTestimonial].procedure}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots Navigation - Responsivo */}
            <div className="flex justify-center gap-2 sm:gap-4 mt-8 sm:mt-10">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-2 sm:h-3 rounded-full transition-all duration-500 ${idx === currentTestimonial ? 'bg-[#D4AF7A] w-8 sm:w-12' : 'bg-[#F5F1EB] w-2 sm:w-3 hover:bg-[#D4AF7A]/50'}`}
                  aria-label={`Ver depoimento ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ INSTAGRAM SECTION - 100% RESPONSIVO */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título Section */}
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[#D4AF7A] font-semibold text-xs sm:text-sm uppercase tracking-wider">Siga-nos</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#5D4E37] mt-3 sm:mt-4 mb-4 sm:mb-6">No Instagram</h2>
            <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] mx-auto rounded-full mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl text-[#666] mb-8 sm:mb-10">Dicas exclusivas, resultados e conteúdo sobre recuperação</p>

            {/* CTA Instagram - Responsivo */}
            <a
              href="https://www.instagram.com/debora.santiago.fisio/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-full font-bold hover:shadow-2xl transition transform hover:-translate-y-2 uppercase text-xs sm:text-sm tracking-wider"
            >
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">Seguir @debora.santiago.fisio</span>
              <span className="sm:hidden">Seguir Agora</span>
            </a>
          </div>

          {/* Grid Instagram - Responsivo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              {
                url: "https://www.instagram.com/reel/DFD2Kw-xliC/",
                media: "/videos/dia-do-medico.mp4",
                type: "video",
                poster: "/images/outubro-rosa.jpg"
              },
              {
                url: "https://www.instagram.com/p/DPHPhyYgBxn/",
                media: "/videos/linfatica.mp4",
                type: "video",
                poster: "/images/linfatica.jpeg"
              },
              {
                url: "https://www.instagram.com/p/DPoP0VrAOde/",
                media: "/images/outubro-rosa.jpg",
                type: "image"
              },
              {
                url: "https://www.instagram.com/p/DPvjeL1DcH6/",
                media: "/videos/transformacao.mp4",
                type: "video",
                poster: "/images/outubro-rosa.jpg"
              }
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl aspect-square shadow-xl cursor-pointer"
              >
                {item.type === 'video' ? (
                  <video
                    src={item.media}
                    poster={item.poster}
                    className="w-full h-full object-cover transition transform group-hover:scale-110 duration-500"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => {
                      if (window.innerWidth > 768) e.target.play();
                    }}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                ) : (
                  <img
                    src={item.media}
                    alt={`Instagram post ${idx + 1}`}
                    className="w-full h-full object-cover transition transform group-hover:scale-110 duration-500"
                  />
                )}

                {/* Overlay - Responsivo */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#5D4E37]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
                  <div className="text-center px-4">
                    {item.type === 'video' ? (
                      <>
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white mx-auto mb-2" />
                        <span className="text-white text-xs sm:text-sm font-semibold uppercase tracking-wider">
                          🎥 Ver Reel
                        </span>
                      </>
                    ) : (
                      <>
                        <Instagram className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white mx-auto mb-2" />
                        <span className="text-white text-xs sm:text-sm font-semibold uppercase tracking-wider">
                          📸 Ver Post
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Badge - Responsivo */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold text-[#5D4E37]">
                  {item.type === 'video' ? '🎬 Reel' : '📷 Post'}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ BLOG SECTION - 100% RESPONSIVO */}
      <section id="blog" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#F5F1EB] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título Section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="text-[#D4AF7A] font-semibold text-xs sm:text-sm uppercase tracking-wider">Conteúdo Exclusivo</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#5D4E37] mt-3 sm:mt-4 mb-4 sm:mb-6">Blog & Dicas</h2>
            <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] mx-auto rounded-full"></div>
          </div>

          {/* Grid Blog Posts - Responsivo */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {blogPosts.map((post, idx) => (
              <div key={idx} className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                {/* Imagem - Responsivo */}
                <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-[#5D4E37] shadow-lg">
                    {post.readTime}
                  </div>
                </div>

                {/* Conteúdo - Responsivo */}
                <div className="p-6 sm:p-8">
                  <div className="text-xs sm:text-sm text-[#D4AF7A] font-semibold mb-2 sm:mb-3">{post.date}</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#5D4E37] mb-3 sm:mb-4 group-hover:text-[#D4AF7A] transition leading-tight">{post.title}</h3>
                  <p className="text-sm sm:text-base text-[#666] mb-4 sm:mb-6 leading-relaxed">{post.excerpt}</p>
                  <button className="text-[#D4AF7A] font-semibold flex items-center gap-2 group-hover:gap-4 transition-all text-sm sm:text-base">
                    Ler mais <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ FAQ SECTION - 100% RESPONSIVO */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título Section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="text-[#D4AF7A] font-semibold text-xs sm:text-sm uppercase tracking-wider">Tire suas Dúvidas</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#5D4E37] mt-3 sm:mt-4 mb-4 sm:mb-6">Perguntas Frequentes</h2>
            <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] mx-auto rounded-full"></div>
          </div>

          {/* FAQ Items - Responsivo */}
          <div className="space-y-4 sm:space-y-6">
            {faq.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#F5F1EB] to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-[#D4AF7A]">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#5D4E37] mb-3 sm:mb-4 flex items-start gap-3 sm:gap-4">
                  <span className="text-3xl sm:text-4xl text-[#D4AF7A] leading-none flex-shrink-0">Q</span>
                  <span className="pt-1">{item.question}</span>
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-[#666] leading-relaxed pl-10 sm:pl-12 md:pl-14">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ CONTACT SECTION - 100% RESPONSIVO */}
      <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#F5F1EB] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título Section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="text-[#D4AF7A] font-semibold text-xs sm:text-sm uppercase tracking-wider">Fale Conosco</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#5D4E37] mt-3 sm:mt-4 mb-4 sm:mb-6">Agende sua Avaliação</h2>
            <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] mx-auto rounded-full mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl text-[#666]">Estamos prontos para cuidar da sua recuperação</p>
          </div>

          {/* Grid 2 Colunas - Responsivo */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">

            {/* Coluna 1: Informações de Contato - Responsivo */}
            <div className="space-y-6 sm:space-y-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#5D4E37] mb-6 sm:mb-8">Informações de Contato</h3>

              <div className="space-y-4 sm:space-y-6">
                {/* Telefone - Responsivo */}
                <div className="flex items-start gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition border-2 border-[#F5F1EB] hover:border-[#D4AF7A]">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#5D4E37] text-base sm:text-lg mb-2">Telefone / WhatsApp</div>
                    <a href="tel:+5511960354728" className="text-[#D4AF7A] hover:text-[#8B7355] font-semibold text-lg sm:text-xl break-all">(11) 96035-4728</a>
                  </div>
                </div>

                {/* Email - Responsivo */}
                <div className="flex items-start gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition border-2 border-[#F5F1EB] hover:border-[#D4AF7A]">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[#5D4E37] text-base sm:text-lg mb-2">Email</div>
                    <a href="mailto:deborabueno_2@hotmail.com" className="text-[#D4AF7A] hover:text-[#8B7355] font-medium text-sm sm:text-base break-all">deborabueno_2@hotmail.com</a>
                  </div>
                </div>

                {/* Localização - Responsivo */}
                <div className="flex items-start gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition border-2 border-[#F5F1EB] hover:border-[#D4AF7A]">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#5D4E37] text-base sm:text-lg mb-2">Localização</div>
                    <p className="text-[#666] leading-relaxed text-sm sm:text-base">
                      Rua Tabapuã, 474 - conjunto 98<br />
                      Itaim Bibi, São Paulo - SP<br />
                      CEP: 04533-001
                    </p>
                  </div>
                </div>

                {/* Horário - Responsivo */}
                <div className="flex items-start gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition border-2 border-[#F5F1EB] hover:border-[#D4AF7A]">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#5D4E37] text-base sm:text-lg mb-2">Horário</div>
                    <p className="text-[#666] text-sm sm:text-base">Segunda a Sexta: 8h às 18h</p>
                    <p className="text-[#666] text-sm sm:text-base">Sábado: 8h às 12h</p>
                  </div>
                </div>

                {/* Instagram Card - Responsivo */}
                <div className="flex items-start gap-4 sm:gap-6 bg-gradient-to-br from-pink-500 to-purple-600 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl text-white">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-base sm:text-lg mb-2">Instagram</div>
                    <a href="https://www.instagram.com/debora.santiago.fisio/" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium text-sm sm:text-base break-all">
                      @debora.santiago.fisio
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 2: Formulário - Responsivo */}
            <div className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-2xl border-2 sm:border-4 border-[#F5F1EB]">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#5D4E37] mb-6 sm:mb-8">Solicite seu Orçamento</h3>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Nome - Responsivo */}
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-5 sm:px-7 py-4 sm:py-5 bg-[#F5F1EB] border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:border-[#D4AF7A] focus:bg-white transition text-[#333] placeholder-[#999] text-base sm:text-lg ${formErrors.name ? 'border-red-500' : 'border-transparent'}`}
                  />
                  {formErrors.name && <span className="text-red-500 text-xs sm:text-sm mt-2 block">{formErrors.name}</span>}
                </div>

                {/* Email - Responsivo */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Seu melhor email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-5 sm:px-7 py-4 sm:py-5 bg-[#F5F1EB] border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:border-[#D4AF7A] focus:bg-white transition text-[#333] placeholder-[#999] text-base sm:text-lg ${formErrors.email ? 'border-red-500' : 'border-transparent'}`}
                  />
                  {formErrors.email && <span className="text-red-500 text-xs sm:text-sm mt-2 block">{formErrors.email}</span>}
                </div>

                {/* Telefone - Responsivo */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-5 sm:px-7 py-4 sm:py-5 bg-[#F5F1EB] border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:border-[#D4AF7A] focus:bg-white transition text-[#333] placeholder-[#999] text-base sm:text-lg ${formErrors.phone ? 'border-red-500' : 'border-transparent'}`}
                  />
                  {formErrors.phone && <span className="text-red-500 text-xs sm:text-sm mt-2 block">{formErrors.phone}</span>}
                </div>

                {/* Select Serviço - Responsivo */}
                <div>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`w-full px-5 sm:px-7 py-4 sm:py-5 bg-[#F5F1EB] border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:border-[#D4AF7A] focus:bg-white transition text-[#333] text-base sm:text-lg ${formErrors.service ? 'border-red-500' : 'border-transparent'}`}
                  >
                    <option value="">Selecione o serviço desejado</option>
                    <option value="drenagem">Drenagem Linfática</option>
                    <option value="ultrassom">Ultrassom Terapêutico</option>
                    <option value="radiofrequencia">Radiofrequência</option>
                    <option value="mobilizacao">Mobilização Cicatricial</option>
                    <option value="exercicios">Exercícios Terapêuticos</option>
                    <option value="orientacoes">Orientações Pós-Operatórias</option>
                  </select>
                  {formErrors.service && <span className="text-red-500 text-xs sm:text-sm mt-2 block">{formErrors.service}</span>}
                </div>

                {/* Textarea - Responsivo */}
                <div>
                  <textarea
                    name="message"
                    placeholder="Conte-me sobre sua cirurgia e suas expectativas (opcional)"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-5 sm:px-7 py-4 sm:py-5 bg-[#F5F1EB] border-2 border-transparent rounded-xl sm:rounded-2xl focus:outline-none focus:border-[#D4AF7A] focus:bg-white transition resize-none text-[#333] placeholder-[#999] text-base sm:text-lg"
                  ></textarea>
                </div>

                {/* Submit Button - Responsivo */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-6 sm:px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-wider"
                >
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  Enviar via WhatsApp
                </button>

                {/* Disclaimer - Responsivo */}
                <p className="text-center text-xs sm:text-sm text-[#666] leading-relaxed">
                  Ao enviar, você será redirecionado para o WhatsApp para finalizar seu orçamento de forma rápida e segura
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ FOOTER PREMIUM - 100% RESPONSIVO */}
      <footer className="bg-[#5D4E37] text-white py-12 sm:py-16 md:py-20 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#D4AF7A]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#8B7355]/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Grid Footer - Responsivo */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">

            {/* Coluna 1: Sobre - Responsivo */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center shadow-xl">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#D4AF7A] tracking-wider">DEBORA SANTIAGO</span>
              </div>
              <p className="text-[#F5F1EB] leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
                Fisioterapia especializada em pós-operatório de cirurgias plásticas.
                Transformando recuperações em experiências excepcionais há mais de 10 anos.
              </p>

              {/* Social Links - Responsivo */}
              <div className="flex gap-3 sm:gap-4">
                <a href="https://www.instagram.com/debora.santiago.fisio/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 sm:w-14 sm:h-14 bg-[#D4AF7A] rounded-full flex items-center justify-center hover:bg-[#8B7355] transition shadow-xl hover:scale-110 transform duration-300">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </a>
                <a href="https://wa.me/5511960354728" target="_blank" rel="noopener noreferrer" className="w-12 h-12 sm:w-14 sm:h-14 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition shadow-xl hover:scale-110 transform duration-300">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </a>
                <a href="mailto:deborabueno_2@hotmail.com" className="w-12 h-12 sm:w-14 sm:h-14 bg-[#8B7355] rounded-full flex items-center justify-center hover:bg-[#D4AF7A] transition shadow-xl hover:scale-110 transform duration-300">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </a>
              </div>
            </div>

            {/* Coluna 2: Links Rápidos - Responsivo */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-[#D4AF7A] mb-4 sm:mb-6">Links Rápidos</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><button onClick={() => scrollToSection('home')} className="text-[#F5F1EB] hover:text-[#D4AF7A] transition hover:pl-2 duration-300 block text-sm sm:text-base">Início</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-[#F5F1EB] hover:text-[#D4AF7A] transition hover:pl-2 duration-300 block text-sm sm:text-base">Sobre</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-[#F5F1EB] hover:text-[#D4AF7A] transition hover:pl-2 duration-300 block text-sm sm:text-base">Serviços</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="text-[#F5F1EB] hover:text-[#D4AF7A] transition hover:pl-2 duration-300 block text-sm sm:text-base">Depoimentos</button></li>
                <li><button onClick={() => scrollToSection('blog')} className="text-[#F5F1EB] hover:text-[#D4AF7A] transition hover:pl-2 duration-300 block text-sm sm:text-base">Blog</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-[#F5F1EB] hover:text-[#D4AF7A] transition hover:pl-2 duration-300 block text-sm sm:text-base">Contato</button></li>
              </ul>
            </div>

            {/* Coluna 3: Contato - Responsivo */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-[#D4AF7A] mb-4 sm:mb-6">Contato</h4>
              <ul className="space-y-3 sm:space-y-4 text-[#F5F1EB] text-sm sm:text-base">
                <li className="flex items-start gap-2 sm:gap-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <span className="break-all">(11) 96035-4728</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <span className="break-all">deborabueno_2@hotmail.com</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <span>Rua Tabapuã, 474 - conjunto 98<br />Itaim Bibi, São Paulo - SP</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <span>Seg-Sex: 8h-18h<br />Sáb: 8h-12h</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright - Responsivo */}
          <div className="border-t-2 border-[#8B7355] pt-8 sm:pt-10 text-center">
            <p className="text-[#F5F1EB] mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">
              © {new Date().getFullYear()} Débora Santiago Fisioterapia. Todos os direitos reservados.
            </p>
            <p className="text-[#D4AF7A] font-bold text-base sm:text-lg mb-2">
              CREFITO-3 | Especialista em Fisioterapia Dermato-Funcional
            </p>
            <p className="text-[#999] text-xs sm:text-sm">
              Desenvolvido por DevAlex-FullStack
            </p>
          </div>
        </div>
      </footer>

      {/* ✅ WHATSAPP FLOATING BUTTON - 100% RESPONSIVO */}

      {/* ✅ WHATSAPP FLOATING BUTTON - 100% RESPONSIVO */}

      <a href="https://wa.me/5511960354728?text=Olá! Gostaria de agendar uma avaliação de fisioterapia pós-cirúrgica."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 group"
        aria-label="Contato via WhatsApp"
      >
        <div className="relative">
          {/* Pulse Effect */}
          <div className="absolute inset-0 bg-[#25D366] rounded-full blur-xl opacity-50 animate-pulse"></div>

          {/* Button - Responsivo */}
          <div className="relative bg-[#25D366] text-white p-4 sm:p-5 md:p-6 rounded-full shadow-2xl hover:bg-[#128C7E] transition transform hover:scale-110 duration-300">
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          </div>
        </div>

        {/* Tooltip - Esconder em mobile */}
        <div className="hidden lg:block absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#5D4E37] text-white px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow-2xl">
          💬 Tire suas dúvidas agora!
        </div>
      </a>

      {/* ✅ VIDEO MODAL - 100% RESPONSIVO */}
      {videoPlaying && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setVideoPlaying(false)}>
          <div className="relative max-w-4xl w-full aspect-video bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden">
            {/* Close Button - Responsivo */}
            <button
              onClick={() => setVideoPlaying(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition z-10"
              aria-label="Fechar vídeo"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Video Content */}
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center p-4">
                <Play className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4" />
                <p className="text-lg sm:text-xl">Vídeo de apresentação</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">Adicione seu vídeo do Instagram aqui</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FisioterapiaDeboraSantiago;