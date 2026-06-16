import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Image, Star, BookOpen, HelpCircle,
  Instagram, Phone, Upload, LogOut, Menu, X,
  ChevronRight, Settings, UserCircle, Heart,
  GalleryHorizontal, Stethoscope, Users
} from 'lucide-react';

const menuGroups = [
  {
    group: 'Principal',
    items: [{ path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    group: 'Conteúdo do Site',
    items: [
      { path: '/admin/hero',          label: 'Hero / Banner',  icon: Image },
      { path: '/admin/about',         label: 'Sobre',          icon: UserCircle },
      { path: '/admin/servicos',      label: 'Serviços',       icon: Heart },
      { path: '/admin/procedimentos', label: 'Procedimentos',  icon: Stethoscope },
      { path: '/admin/depoimentos',   label: 'Depoimentos',    icon: Star },
      { path: '/admin/faq',           label: 'FAQ',            icon: HelpCircle },
    ],
  },
  {
    group: 'Mídia & Conteúdo',
    items: [
      { path: '/admin/galeria',   label: 'Galeria',         icon: GalleryHorizontal },
      { path: '/admin/blog',      label: 'Blog',            icon: BookOpen },
      { path: '/admin/instagram', label: 'Instagram',       icon: Instagram },
      { path: '/admin/midia',     label: 'Upload de Mídia', icon: Upload },
    ],
  },
  {
    group: 'Configurações',
    items: [
      { path: '/admin/contato',  label: 'Contato',         icon: Phone },
      { path: '/admin/settings', label: 'Config. do Site', icon: Settings },
    ],
  },
];

// ── FIX: SidebarContent extraído do componente pai ─────────────────────
// Antes estava definido dentro de AdminLayout, causando unmount/remount
// a cada render (nova referência de função = novo componente para o React).
interface SidebarProps {
  activePath:    string;
  adminNome:     string;
  adminEmail:    string;
  onLinkClick:   () => void;
  onLogout:      () => void;
}

const SidebarContent = React.memo(({
  activePath, adminNome, adminEmail, onLinkClick, onLogout,
}: SidebarProps) => (
  <div className="flex flex-col h-full bg-[#3D2E1E] overflow-hidden">

    {/* Logo */}
    <div className="flex items-center gap-3 px-5 py-5 border-b border-[#5D4E37]">
      <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl">
        <img src="/logo.png" alt="Débora Santiago" className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-[#D4AF7A] font-bold text-sm leading-tight truncate">Débora Santiago</p>
        <p className="text-white/50 text-[11px] leading-tight">Painel Administrativo</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
      {menuGroups.map(({ group, items }) => (
        <div key={group}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 mb-1.5">
            {group}
          </p>
          <div className="space-y-0.5">
            {items.map(({ path, label, icon: Icon }) => {
              const active = activePath === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={onLinkClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-[#D4AF7A] text-white shadow-lg shadow-[#D4AF7A]/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70 flex-shrink-0" />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>

    {/* User + Logout */}
    <div className="px-3 py-4 border-t border-[#5D4E37] space-y-2">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-white/5 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-[#D4AF7A] flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-xs font-semibold truncate">{adminNome}</p>
          <p className="text-white/40 text-[10px] truncate">{adminEmail}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:bg-red-500/20 hover:text-red-300 transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Sair</span>
      </button>
    </div>
  </div>
));
SidebarContent.displayName = 'SidebarContent';

// ── AdminLayout ────────────────────────────────────────────────────────
interface Props { children: React.ReactNode; title: string; }

const AdminLayout = ({ children, title }: Props) => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin'); };

  const sidebarProps: SidebarProps = {
    activePath:  location.pathname,
    adminNome:   admin?.nome  || 'Admin',
    adminEmail:  admin?.email || '',
    onLinkClick: () => setOpen(false),
    onLogout:    handleLogout,
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex">

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col fixed inset-y-0 left-0 z-30 shadow-2xl">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Sidebar Mobile/Tablet overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl flex flex-col">
            <SidebarContent {...sidebarProps} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#F5F1EB] shadow-sm">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#F5F1EB] text-[#5D4E37] hover:bg-[#E8E0D5] transition flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl overflow-hidden">
                <img src="/logo.png" alt="DS" className="w-full h-full object-cover" />
              </div>
            </div>
            <h1 className="flex-1 text-base sm:text-lg lg:text-xl font-bold text-[#5D4E37] truncate">
              {title}
            </h1>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#D4AF7A] hover:text-[#8B7355] transition bg-[#F5F1EB] hover:bg-[#E8E0D5] px-4 py-2 rounded-xl whitespace-nowrap">
              Ver Site →
            </a>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-5 lg:p-8 max-w-full overflow-x-hidden">
          {children}
        </main>

        <footer className="text-center py-3 text-[10px] sm:text-xs text-[#ccc] border-t border-[#F5F1EB]">
          Débora Santiago · Painel Admin v2.0
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;