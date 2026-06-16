import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SEO from './components/SEO';

// Landing Page
import FisioterapiaDeboraSantiago from './components/LandingPage';

// Blog público
import BlogPage     from './pages/blog/BlogPage';
import BlogPostPage from './pages/blog/BlogPostPage';

// Admin
import LoginPage          from './pages/admin/LoginPage';
import DashboardPage      from './pages/admin/DashboardPage';
import HeroAdmin          from './pages/admin/HeroAdmin';
import AboutAdmin         from './pages/admin/AboutAdmin';
import ServicosAdmin      from './pages/admin/ServicosAdmin';
import ProcedimentosAdmin from './pages/admin/ProcedimentosAdmin';
import DepoimentosAdmin   from './pages/admin/DepoimentosAdmin';
import BlogAdmin          from './pages/admin/BlogAdmin';
import FaqAdmin           from './pages/admin/FaqAdmin';
import InstagramAdmin     from './pages/admin/InstagramAdmin';
import ContatoAdmin       from './pages/admin/ContatoAdmin';
import GaleriaAdmin       from './pages/admin/GaleriaAdmin';
import MidiaAdmin         from './pages/admin/MidiaAdmin';
import SettingsAdmin      from './pages/admin/SettingsAdmin';
import ProtectedRoute     from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <SEO
              title="Débora Santiago | Fisioterapia Pós-Operatória e Pós-Cirurgia Plástica"
              description="Fisioterapia especializada em pós-operatório de cirurgia plástica, drenagem linfática, recuperação pós-cirúrgica e reabilitação com atendimento em clínica, parceiros e domicílio."
              url="https://www.deborasantiago.com/"
            />
            <FisioterapiaDeboraSantiago />
          </>
        }
      />

      <Route
        path="/blog"
        element={
          <>
            <SEO
              title="Blog | Débora Santiago Fisioterapia"
              description="Conteúdos sobre fisioterapia pós-operatória, cirurgia plástica, drenagem linfática, recuperação pós-cirúrgica e cuidados com a saúde."
              url="https://www.deborasantiago.com/blog"
            />
            <BlogPage />
          </>
        }
      />

      <Route path="/blog/:slug" element={<BlogPostPage />} />

      <Route path="/admin" element={<LoginPage />} />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/admin/hero" element={
        <ProtectedRoute><HeroAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/about" element={
        <ProtectedRoute><AboutAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/servicos" element={
        <ProtectedRoute><ServicosAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/procedimentos" element={
        <ProtectedRoute><ProcedimentosAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/depoimentos" element={
        <ProtectedRoute><DepoimentosAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/blog" element={
        <ProtectedRoute><BlogAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/faq" element={
        <ProtectedRoute><FaqAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/instagram" element={
        <ProtectedRoute><InstagramAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/contato" element={
        <ProtectedRoute><ContatoAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/galeria" element={
        <ProtectedRoute><GaleriaAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/midia" element={
        <ProtectedRoute><MidiaAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute><SettingsAdmin /></ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;