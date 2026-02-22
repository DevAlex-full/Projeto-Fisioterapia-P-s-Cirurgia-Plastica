import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';
import { Save, Loader, Eye } from 'lucide-react';

const AboutAdmin = () => {
  const [form, setForm] = useState({ nome: '', titulo: '', descricao1: '', descricao2: '', fotoUrl: '', anosExp: '', pacientes: '', satisfacao: '', especializacoes: '', crefito: '', especialidade: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.get('/api/about').then(({ data }) => {
      setForm({ nome: data.nome || '', titulo: data.titulo || '', descricao1: data.descricao1 || '', descricao2: data.descricao2 || '', fotoUrl: data.fotoUrl || '', anosExp: String(data.anosExp || ''), pacientes: String(data.pacientes || ''), satisfacao: String(data.satisfacao || ''), especializacoes: String(data.especializacoes || ''), crefito: data.crefito || '', especialidade: data.especialidade || '' });
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try { await api.put('/api/about', form); setMsg({ type: 'success', text: '✅ Seção "Sobre" atualizada!' }); }
    catch { setMsg({ type: 'error', text: '❌ Erro ao salvar.' }); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="Sobre"><div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" /></div></AdminLayout>;

  return (
    <AdminLayout title="Sobre — Débora Santiago">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* FORMULÁRIO */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#F5F1EB]">
          <h2 className="text-xl font-bold text-[#5D4E37] mb-6">✏️ Editar Seção Sobre</h2>
          {msg && <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[{ name: 'nome', label: 'Nome' }, { name: 'titulo', label: 'Título da Seção' }, { name: 'crefito', label: 'CREFITO' }, { name: 'especialidade', label: 'Especialidade' }].map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">{f.label}</label>
                  <input type="text" name={f.name} value={(form as any)[f.name]} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-[#333] text-sm" />
                </div>
              ))}
            </div>
            {[{ name: 'descricao1', label: 'Descrição 1' }, { name: 'descricao2', label: 'Descrição 2 (missão)' }].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">{f.label}</label>
                <textarea name={f.name} value={(form as any)[f.name]} onChange={handleChange} rows={2}
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none text-[#333] text-sm" />
              </div>
            ))}
            <ImageUpload label="Foto da Débora" value={form.fotoUrl} onChange={(url) => setForm(f => ({ ...f, fotoUrl: url }))} previewH="h-52" />
            <div>
              <label className="block text-sm font-semibold text-[#5D4E37] mb-3">📊 Estatísticas</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{ name: 'anosExp', label: 'Anos Exp.' }, { name: 'pacientes', label: 'Pacientes' }, { name: 'satisfacao', label: 'Satisfação %' }, { name: 'especializacoes', label: 'Especializações' }].map(f => (
                  <div key={f.name} className="bg-[#F5F1EB] rounded-2xl p-3 text-center">
                    <label className="block text-xs text-[#999] mb-1">{f.label}</label>
                    <input type="number" name={f.name} value={(form as any)[f.name]} onChange={handleChange}
                      className="w-full bg-transparent text-center font-extrabold text-[#5D4E37] text-xl focus:outline-none" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="mt-6 w-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-4 rounded-2xl font-bold hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <><Loader className="w-5 h-5 animate-spin" /> Salvando...</> : <><Save className="w-5 h-5" /> Salvar Alterações</>}
          </button>
        </div>

        {/* PREVIEW */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#5D4E37] font-bold text-lg">
            <Eye className="w-5 h-5 text-[#D4AF7A]" /> Preview ao Vivo
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-[#F5F1EB]">
            <p className="text-xs text-[#D4AF7A] font-bold uppercase tracking-wider mb-1">{form.titulo || 'Conheça a Especialista'}</p>
            <h2 className="text-2xl font-extrabold text-[#5D4E37] mb-3">{form.nome || 'Nome da Especialista'}</h2>
            <div className="flex gap-4 mb-4">
              {form.fotoUrl
                ? <img src={form.fotoUrl} alt={form.nome} className="w-28 h-28 rounded-2xl object-cover flex-shrink-0 shadow-lg" />
                : <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex-shrink-0 flex items-center justify-center text-3xl">👩‍⚕️</div>
              }
              <div>
                <p className="text-xs text-[#666] leading-relaxed mb-2">{form.descricao1 || 'Descrição 1 aparecerá aqui...'}</p>
                <span className="text-xs bg-[#D4AF7A]/20 text-[#8B7355] px-2 py-1 rounded-full font-semibold">{form.especialidade || 'Especialidade'}</span>
              </div>
            </div>
            <p className="text-xs text-[#666] leading-relaxed mb-4">{form.descricao2 || 'Descrição 2 aparecerá aqui...'}</p>
            <div className="grid grid-cols-4 gap-2">
              {[{ val: form.anosExp, label: 'Anos', s: '+' }, { val: form.pacientes, label: 'Pacientes', s: '+' }, { val: form.satisfacao, label: 'Satisfação', s: '%' }, { val: form.especializacoes, label: 'Especial.', s: '+' }].map((s, i) => (
                <div key={i} className="bg-[#F5F1EB] rounded-xl p-2 text-center">
                  <p className="text-lg font-extrabold text-[#5D4E37]">{s.val || '0'}{s.s}</p>
                  <p className="text-xs text-[#999]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <a href="/#about" target="_blank"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-[#D4AF7A] text-[#D4AF7A] rounded-2xl font-semibold hover:bg-[#D4AF7A]/5 transition">
            <Eye className="w-4 h-4" /> Ver no Site ao Vivo
          </a>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutAdmin;