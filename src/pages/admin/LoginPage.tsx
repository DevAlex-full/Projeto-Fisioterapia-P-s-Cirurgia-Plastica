import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Eye, EyeOff, Lock, Mail } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Se já está logado, redireciona
  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Email ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1EB] via-white to-[#F5F1EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#5D4E37]">Débora Santiago</h1>
          <p className="text-[#999] text-sm mt-1">Painel Administrativo</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-[#F5F1EB]">
          <h2 className="text-xl font-bold text-[#5D4E37] mb-6 text-center">Entrar no Painel</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#5D4E37] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF7A]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-[#F5F1EB] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#D4AF7A] focus:bg-white transition text-[#333]"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-[#5D4E37] mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF7A]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-[#F5F1EB] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#D4AF7A] focus:bg-white transition text-[#333]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#D4AF7A]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-4 rounded-2xl font-bold hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Entrando...</>
              ) : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;