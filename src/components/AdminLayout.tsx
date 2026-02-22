import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Image, Users, Star, BookOpen,
  HelpCircle, Instagram, Phone, Upload, LogOut,
  Menu, X, Heart, ChevronRight, Settings, UserCircle
} from 'lucide-react';

const menuItems = [
  { path: '/admin/dashboard',   label: 'Dashboard',     icon: LayoutDashboard },
  { path: '/admin/hero',        label: 'Hero / Banner', icon: Image },
  { path: '/admin/about',       label: 'Sobre',         icon: UserCircle },
  { path: '/admin/servicos',    label: 'Serviços',      icon: Heart },
  { path: '/admin/depoimentos', label: 'Depoimentos',   icon: Star },
  { path: '/admin/blog',        label: 'Blog',          icon: BookOpen },
  { path: '/admin/faq',         label: 'FAQ',           icon: HelpCircle },
  { path: '/admin/instagram',   label: 'Instagram',     icon: Instagram },
  { path: '/admin/contato',     label: 'Contato',       icon: Phone },
  { path: '/admin/midia',       label: 'Mídia / Upload',icon: Upload },
];

interface Props {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: Props) => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#5D4E37]">
      {/* Logo */}
      <div className="p-6 border-b border-[#8B7355]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Débora Santiago</p>
            <p className="text-[#D4AF7A] text-xs">Painel Admin</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-[#D4AF7A] text-white shadow-lg'
                  : 'text-[#F5F1EB] hover:bg-[#8B7355] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-[#8B7355]">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#D4AF7A] flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{admin?.nome}</p>
            <p className="text-[#D4AF7A] text-xs truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#F5F1EB] hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-5 h-5" />
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#F5F1EB] text-[#5D4E37]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-[#5D4E37]">{title}</h1>
          </div>
          <Link
            to="/"
            target="_blank"
            className="text-xs sm:text-sm text-[#D4AF7A] hover:text-[#8B7355] font-medium transition"
          >
            Ver Site →
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;