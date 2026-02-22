import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Image, UserCircle, Heart, Star, BookOpen,
  HelpCircle, Instagram, Phone, Upload, ExternalLink,
  TrendingUp, CheckCircle
} from 'lucide-react';

const cards = [
  { label: 'Hero / Banner',  path: '/admin/hero',        icon: Image,       color: 'from-purple-400 to-purple-600',  desc: 'Editar título, vídeo e CTA' },
  { label: 'Sobre',          path: '/admin/about',       icon: UserCircle,  color: 'from-blue-400 to-blue-600',      desc: 'Editar foto e textos' },
  { label: 'Serviços',       path: '/admin/servicos',    icon: Heart,       color: 'from-[#D4AF7A] to-[#8B7355]',   desc: 'Gerenciar serviços' },
  { label: 'Depoimentos',    path: '/admin/depoimentos', icon: Star,        color: 'from-yellow-400 to-orange-500',  desc: 'Gerenciar avaliações' },
  { label: 'Blog',           path: '/admin/blog',        icon: BookOpen,    color: 'from-green-400 to-green-600',    desc: 'Criar e editar posts' },
  { label: 'FAQ',            path: '/admin/faq',         icon: HelpCircle,  color: 'from-teal-400 to-teal-600',      desc: 'Perguntas frequentes' },
  { label: 'Instagram',      path: '/admin/instagram',   icon: Instagram,   color: 'from-pink-500 to-purple-600',    desc: 'Gerenciar posts' },
  { label: 'Contato',        path: '/admin/contato',     icon: Phone,       color: 'from-red-400 to-red-600',        desc: 'Telefone, endereço, horário' },
  { label: 'Mídia / Upload', path: '/admin/midia',       icon: Upload,      color: 'from-gray-400 to-gray-600',      desc: 'Upload de imagens e vídeos' },
];

const DashboardPage = () => {
  const [stats, setStats] = useState({ servicos: 0, depoimentos: 0, blog: 0, faq: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [srv, dep, blg, faq] = await Promise.all([
          api.get('/api/servicos/all'),
          api.get('/api/depoimentos/all'),
          api.get('/api/blog/all'),
          api.get('/api/faq/all'),
        ]);
        setStats({
          servicos: srv.data.length,
          depoimentos: dep.data.length,
          blog: blg.data.length,
          faq: faq.data.length,
        });
      } catch {
        // silencioso
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* Boas-vindas */}
      <div className="bg-gradient-to-r from-[#5D4E37] to-[#8B7355] rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Bem-vinda ao seu Painel! 👋</h2>
        <p className="text-[#F5F1EB] opacity-90">Gerencie todo o conteúdo do seu site a partir daqui.</p>
        <a href="/" target="_blank" className="inline-flex items-center gap-2 mt-4 bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-full text-sm font-semibold transition">
          <ExternalLink className="w-4 h-4" /> Ver Site ao Vivo
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Serviços',     value: stats.servicos,    icon: Heart,      color: 'text-[#D4AF7A]' },
          { label: 'Depoimentos',  value: stats.depoimentos, icon: Star,       color: 'text-yellow-500' },
          { label: 'Posts Blog',   value: stats.blog,        icon: BookOpen,   color: 'text-green-500' },
          { label: 'FAQs',         value: stats.faq,         icon: HelpCircle, color: 'text-blue-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-md border-2 border-[#F5F1EB]">
            <s.icon className={`w-7 h-7 ${s.color} mb-3`} />
            <p className="text-3xl font-extrabold text-[#5D4E37]">{s.value}</p>
            <p className="text-sm text-[#999] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards de Acesso Rápido */}
      <h3 className="text-lg font-bold text-[#5D4E37] mb-4">Gerenciar Conteúdo</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#F5F1EB] hover:border-[#D4AF7A] transform hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-[#5D4E37] mb-1">{card.label}</h4>
            <p className="text-sm text-[#999]">{card.desc}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;