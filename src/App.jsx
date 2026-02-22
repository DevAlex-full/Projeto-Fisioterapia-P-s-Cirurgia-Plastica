import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Landing Page original
import FisioterapiaDeboraSantiago from './components/LandingPage';

// Blog
import BlogPage from './pages/Blog/BlogPage';
import BlogPostPage from './pages/Blog/BlogPostPage';

// Admin
import LoginPage from './pages/Admin/LoginPage';
import DashboardPage from './pages/Admin/DashboardPage';
import HeroAdmin from './pages/Admin/HeroAdmin';
import AboutAdmin from './pages/Admin/AboutAdmin';
import ServicosAdmin from './pages/Admin/ServicosAdmin';
import DepoimentosAdmin from './pages/Admin/DepoimentosAdmin';
import BlogAdmin from './pages/Admin/BlogAdmin';
import FaqAdmin from './pages/Admin/FaqAdmin';
import InstagramAdmin from './pages/Admin/InstagramAdmin';
import ContatoAdmin from './pages/Admin/ContatoAdmin';
import MidiaAdmin from './pages/Admin/MidiaAdmin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* ===== SITE PÚBLICO ===== */}
      <Route path="/" element={<FisioterapiaDeboraSantiago />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />

      {/* ===== ADMIN ===== */}
      <Route path="/admin" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/admin/hero" element={<ProtectedRoute><HeroAdmin /></ProtectedRoute>} />
      <Route path="/admin/about" element={<ProtectedRoute><AboutAdmin /></ProtectedRoute>} />
      <Route path="/admin/servicos" element={<ProtectedRoute><ServicosAdmin /></ProtectedRoute>} />
      <Route path="/admin/depoimentos" element={<ProtectedRoute><DepoimentosAdmin /></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute><BlogAdmin /></ProtectedRoute>} />
      <Route path="/admin/faq" element={<ProtectedRoute><FaqAdmin /></ProtectedRoute>} />
      <Route path="/admin/instagram" element={<ProtectedRoute><InstagramAdmin /></ProtectedRoute>} />
      <Route path="/admin/contato" element={<ProtectedRoute><ContatoAdmin /></ProtectedRoute>} />
      <Route path="/admin/midia" element={<ProtectedRoute><MidiaAdmin /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;