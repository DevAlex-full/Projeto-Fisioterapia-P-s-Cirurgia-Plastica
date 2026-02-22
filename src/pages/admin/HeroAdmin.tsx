import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';
import { Save, Loader, Eye } from 'lucide-react';

const HeroAdmin = () => {
  const [form, setForm] = useState({ titulo: '', subtitulo: '', descricao: '', badge: '', ctaPrimario: '', ctaSecundario: '', videoUrl: '', posterUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.get('/api/hero').then(({ data }) => {
      setForm({ titulo: data.titulo || '', subtitulo: data.subtitulo || '', descricao: data.descricao || '', badge: data.badge || '', ctaPrimario: data.ctaPrimario || '', ctaSecundario: data.ctaSecundario || '', videoUrl: data.videoUrl || '', posterUrl: data.posterUrl || '' });
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try { await api.put('/api/hero', form); setMsg({ type: 'success', text: '✅ Hero atualizado!' }); }
    catch { setMsg({ type: 'error', text: '❌ Erro ao salvar.' }); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="Hero / Banner"><div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" /></div></AdminLayout>;

  return (
    <AdminLayout title="Hero / Banner">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* FORMULÁRIO */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#F5F1EB]">
          <h2 className="text-xl font-bold text-[#5D4E37] mb-6">✏️ Editar Seção Principal</h2>
          {msg && <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}
          <div className="space-y-4">
            {(['badge', 'titulo', 'subtitulo', 'ctaPrimario', 'ctaSecundario'] as const).map(name => (
              <div key={name}>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2 capitalize">{name === 'ctaPrimario' ? 'Botão Primário' : name === 'ctaSecundario' ? 'Botão Secundário' : name.charAt(0).toUpperCase() + name.slice(1)}</label>
                <input type="text" name={name} value={form[name]} onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-[#333]" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Descrição</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none text-[#333]" />
            </div>
            <ImageUpload label="Imagem Poster do Vídeo" value={form.posterUrl} onChange={(url) => setForm(f => ({ ...f, posterUrl: url }))} previewH="h-40" />
            <div>
              <label className="block text-sm font-semibold text-[#5D4E37] mb-2">URL do Vídeo</label>
              <input type="text" name="videoUrl" value={form.videoUrl} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-[#333]" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="mt-6 w-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-4 rounded-2xl font-bold hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <><Loader className="w-5 h-5 animate-spin" /> Salvando...</> : <><Save className="w-5 h-5" /> Salvar Alterações</>}
          </button>
        </div>

        {/* PREVIEW AO VIVO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#5D4E37] font-bold text-lg">
            <Eye className="w-5 h-5 text-[#D4AF7A]" /> Preview ao Vivo
          </div>
          <div className="bg-gradient-to-br from-[#5D4E37] to-[#8B7355] rounded-3xl p-6 text-white shadow-xl min-h-64">
            <span className="inline-block bg-[#D4AF7A]/30 border border-[#D4AF7A] text-[#D4AF7A] text-xs px-3 py-1 rounded-full font-semibold mb-4">
              {form.badge || 'Badge aqui'}
            </span>
            <h1 className="text-3xl font-extrabold leading-tight mb-1">{form.titulo || 'Título Principal'}</h1>
            <h2 className="text-3xl font-extrabold text-[#D4AF7A] mb-3">{form.subtitulo || 'Subtítulo'}</h2>
            <p className="text-sm text-[#F5F1EB]/80 mb-5 leading-relaxed">{form.descricao || 'Descrição aparecerá aqui...'}</p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[#D4AF7A] text-white text-sm px-4 py-2 rounded-full font-semibold">{form.ctaPrimario || 'Botão Primário'}</span>
              <span className="border border-white/50 text-white text-sm px-4 py-2 rounded-full font-semibold">{form.ctaSecundario || 'Botão Secundário'}</span>
            </div>
            {form.posterUrl && (
              <div className="mt-4 rounded-2xl overflow-hidden h-32">
                <img src={form.posterUrl} alt="Poster" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700">
            💡 O preview atualiza em tempo real conforme você digita.
          </div>
          <a href="/" target="_blank"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-[#D4AF7A] text-[#D4AF7A] rounded-2xl font-semibold hover:bg-[#D4AF7A]/5 transition">
            <Eye className="w-4 h-4" /> Ver no Site ao Vivo
          </a>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HeroAdmin;