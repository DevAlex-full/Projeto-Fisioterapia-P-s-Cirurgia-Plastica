import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Image, Users, Star, BookOpen,
  HelpCircle, Instagram, Phone, Upload, LogOut,
  Menu, X, Heart, ChevronRight, Settings,
  UserCircle, GalleryHorizontal, Stethoscope
} from 'lucide-react';

const menuItems = [
  {
    group: 'Principal',
    items: [
      { path: '/admin/dashboard',      label: 'Dashboard',       icon: LayoutDashboard },
    ]
  },
  {
    group: 'Conteúdo do Site',
    items: [
      { path: '/admin/hero',           label: 'Hero / Banner',   icon: Image },
      { path: '/admin/about',          label: 'Sobre',           icon: UserCircle },
      { path: '/admin/servicos',       label: 'Serviços',        icon: Heart },
      { path: '/admin/procedimentos',  label: 'Procedimentos',   icon: Stethoscope },
      { path: '/admin/depoimentos',    label: 'Depoimentos',     icon: Star },
      { path: '/admin/faq',            label: 'FAQ',             icon: HelpCircle },
    ]
  },
  {
    group: 'Mídia & Conteúdo',
    items: [
      { path: '/admin/galeria',        label: 'Galeria',         icon: GalleryHorizontal },
      { path: '/admin/blog',           label: 'Blog',            icon: BookOpen },
      { path: '/admin/instagram',      label: 'Instagram',       icon: Instagram },
      { path: '/admin/midia',          label: 'Upload de Mídia', icon: Upload },
    ]
  },
  {
    group: 'Configurações',
    items: [
      { path: '/admin/contato',        label: 'Contato',         icon: Phone },
      { path: '/admin/settings',       label: 'Config. do Site', icon: Settings },
    ]
  },
];

interface Props {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: Props) => {
  const { admin, logout } = useAuth();
  const location           = useLocation();
  const navigate           = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin'); };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#5D4E37]">
      {/* Logo */}
      <div className="p-5 border-b border-[#8B7355]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Débora Santiago</p>
            <p className="text-[#D4AF7A] text-xs">Painel Administrativo</p>
          </div>
        </div>
      </div>

      {/* Menu com grupos */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((group) => (
          <div key={group.group} className="mb-2">
            <p className="text-[#D4AF7A]/50 text-[10px] font-bold uppercase tracking-widest px-5 mb-1">
              {group.group}
            </p>
            {group.items.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 mx-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-[#D4AF7A] text-white shadow-lg shadow-[#D4AF7A]/30'
                      : 'text-[#F5F1EB]/80 hover:bg-[#8B7355]/50 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {active && <ChevronRight className="w-3 h-3 ml-auto opacity-70" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-[#8B7355]/50">
        <div className="flex items-center gap-3 mb-3 bg-[#8B7355]/30 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{admin?.nome}</p>
            <p className="text-[#D4AF7A] text-[10px] truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#F5F1EB]/70 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col shadow-2xl">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[#F5F1EB]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#F5F1EB] text-[#5D4E37] transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[#5D4E37]">{title}</h1>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs sm:text-sm text-[#D4AF7A] hover:text-[#8B7355] font-semibold transition bg-[#F5F1EB] px-4 py-2 rounded-xl"
          >
            Ver Site ao Vivo →
          </a>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-[#bbb]">
          Débora Santiago · Painel Admin v2.0
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;