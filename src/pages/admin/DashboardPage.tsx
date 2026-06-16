import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Image, UserCircle, Heart, Star, BookOpen,
  HelpCircle, Instagram, Phone, Upload, ExternalLink,
  GalleryHorizontal, Stethoscope, Settings,
  TrendingUp, FileText, Loader, RefreshCw
} from 'lucide-react';

const quickCards = [
  { label:'Hero / Banner',   path:'/admin/hero',          icon:Image,            color:'from-violet-400 to-violet-600',  desc:'Título, vídeo e CTA' },
  { label:'Sobre',           path:'/admin/about',         icon:UserCircle,        color:'from-blue-400 to-blue-600',      desc:'Foto, textos e stats' },
  { label:'Serviços',        path:'/admin/servicos',      icon:Heart,             color:'from-[#D4AF7A] to-[#8B7355]',   desc:'Gerenciar serviços' },
  { label:'Procedimentos',   path:'/admin/procedimentos', icon:Stethoscope,       color:'from-teal-400 to-teal-600',      desc:'Lista de procedimentos' },
  { label:'Depoimentos',     path:'/admin/depoimentos',   icon:Star,              color:'from-yellow-400 to-orange-500',  desc:'Avaliações de pacientes' },
  { label:'Blog',            path:'/admin/blog',          icon:BookOpen,          color:'from-green-400 to-green-600',    desc:'Criar e editar posts' },
  { label:'FAQ',             path:'/admin/faq',           icon:HelpCircle,        color:'from-cyan-400 to-cyan-600',      desc:'Perguntas frequentes' },
  { label:'Galeria',         path:'/admin/galeria',       icon:GalleryHorizontal, color:'from-pink-400 to-pink-600',      desc:'Fotos e vídeos' },
  { label:'Instagram',       path:'/admin/instagram',     icon:Instagram,         color:'from-fuchsia-500 to-purple-600', desc:'Posts do Instagram' },
  { label:'Contato',         path:'/admin/contato',       icon:Phone,             color:'from-red-400 to-red-600',        desc:'Tel, endereço, horário' },
  { label:'Upload de Mídia', path:'/admin/midia',         icon:Upload,            color:'from-gray-400 to-gray-600',      desc:'Upload de arquivos' },
  { label:'Config. do Site', path:'/admin/settings',      icon:Settings,          color:'from-slate-400 to-slate-600',    desc:'Logo, cores, SEO' },
];

interface Stats {
  servicos: number; depoimentos: number; blog: number;
  faq: number; procedimentos: number; galeria: number; instagram: number;
}

const EMPTY: Stats = {
  servicos:0, depoimentos:0, blog:0,
  faq:0, procedimentos:0, galeria:0, instagram:0,
};

const DashboardPage = () => {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const fetchStats = async () => {
    setLoading(true); setError(false);
    try {
      // FIX CRÍTICO: Promise.allSettled → nunca zera todos os contadores
      // por falha isolada de um único request (ex: backend acordando no Render)
      const [srv, dep, blg, faq, proc, gal, insta] = await Promise.allSettled([
        api.get('/api/servicos/all'),
        api.get('/api/depoimentos/all'),
        api.get('/api/blog/all'),
        api.get('/api/faq/all'),
        api.get('/api/procedimentos/all'),
        api.get('/api/midia/all'),
        api.get('/api/instagram/all'),
      ]);

      const count = (r: PromiseSettledResult<any>) =>
        r.status === 'fulfilled' ? (r.value.data?.length ?? 0) : 0;

      setStats({
        servicos:      count(srv),
        depoimentos:   count(dep),
        blog:          count(blg),
        faq:           count(faq),
        procedimentos: count(proc),
        galeria:       count(gal),
        instagram:     count(insta),
      });
    } catch {
      setStats(EMPTY);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const total = stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0;

  const statCards = stats ? [
    { label:'Serviços',       value:stats.servicos,      icon:Heart,             color:'from-[#D4AF7A] to-[#8B7355]' },
    { label:'Depoimentos',    value:stats.depoimentos,   icon:Star,              color:'from-yellow-400 to-orange-500' },
    { label:'Posts Blog',     value:stats.blog,          icon:BookOpen,          color:'from-green-400 to-green-600' },
    { label:'FAQ',            value:stats.faq,           icon:HelpCircle,        color:'from-cyan-400 to-cyan-600' },
    { label:'Procedimentos',  value:stats.procedimentos, icon:Stethoscope,       color:'from-teal-400 to-teal-600' },
    { label:'Galeria',        value:stats.galeria,       icon:GalleryHorizontal, color:'from-pink-400 to-pink-600' },
    { label:'Instagram',      value:stats.instagram,     icon:Instagram,         color:'from-fuchsia-500 to-purple-600' },
    { label:'Total Conteúdo', value:total,               icon:TrendingUp,        color:'from-slate-400 to-slate-600' },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      {/* Boas-vindas */}
      <div className="relative bg-gradient-to-br from-[#5D4E37] via-[#7A6248] to-[#8B7355]
        rounded-3xl p-7 sm:p-10 text-white mb-8 shadow-xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#D4AF7A]/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#D4AF7A]/10 rounded-full" />
        <div className="relative z-10">
          <p className="text-[#D4AF7A] text-sm font-semibold mb-1 tracking-widest uppercase">
            Bem-vinda de volta 👋
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Painel de Controle</h2>
          <p className="text-[#F5F1EB]/80 text-sm max-w-lg">
            Gerencie todo o conteúdo do site — textos, imagens, blog, depoimentos e configurações.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 px-5 py-2.5 rounded-xl text-sm font-semibold transition">
              <ExternalLink className="w-4 h-4" /> Ver Site ao Vivo
            </a>
            <Link to="/admin/settings"
              className="inline-flex items-center gap-2 bg-[#D4AF7A]/20 hover:bg-[#D4AF7A]/30 px-5 py-2.5 rounded-xl text-sm font-semibold transition">
              <Settings className="w-4 h-4" /> Configurações
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-base font-bold text-[#5D4E37] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#D4AF7A]" /> Conteúdo Cadastrado
            </h3>
            {error && (
              <button onClick={fetchStats}
                className="flex items-center gap-1.5 text-xs text-[#D4AF7A] font-semibold hover:text-[#8B7355] transition">
                <RefreshCw className="w-3.5 h-3.5" /> Tentar novamente
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
            {statCards.map((s, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-4 shadow-sm border-2 border-[#F5F1EB]
                  flex flex-col items-center text-center hover:shadow-md transition">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color}
                  flex items-center justify-center mb-2 shadow`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-extrabold text-[#5D4E37]">{s.value}</p>
                <p className="text-[10px] text-[#999] mt-0.5 font-medium leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          <h3 className="text-base font-bold text-[#5D4E37] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF7A]" /> Gerenciar Conteúdo
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            {quickCards.map((card) => (
              <Link key={card.path} to={card.path}
                className="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl
                  transition-all duration-300 border-2 border-[#F5F1EB] hover:border-[#D4AF7A]
                  transform hover:-translate-y-1">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${card.color}
                  flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-[#5D4E37] text-xs sm:text-sm">{card.label}</p>
                <p className="text-xs text-[#999] mt-0.5 hidden sm:block">{card.desc}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;