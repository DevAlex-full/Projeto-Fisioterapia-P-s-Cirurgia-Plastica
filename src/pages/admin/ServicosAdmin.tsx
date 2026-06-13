import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Save, X, Loader, ToggleLeft, ToggleRight } from 'lucide-react';

interface Servico { id: string; titulo: string; descricao: string; icone: string; beneficios: string[]; duracao: string; preco: string; cor: string; ordem: number; ativo: boolean; }
const emptyForm = { titulo: '', descricao: '', icone: '💆‍♀️', beneficios: [''], duracao: '60 min', preco: 'Consulte', cor: 'from-purple-400 to-purple-600', ordem: 0 };

const ServicosAdmin = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<string | null>(null);
  const [form,     setForm]     = useState(emptyForm);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => { const { data } = await api.get('/api/servicos/all'); setServicos(data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (s: Servico) => {
    setForm({ titulo: s.titulo, descricao: s.descricao, icone: s.icone, beneficios: s.beneficios, duracao: s.duracao, preco: s.preco, cor: s.cor, ordem: s.ordem });
    setEditing(s.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.titulo || !form.descricao) return setMsg({ type: 'error', text: 'Título e descrição são obrigatórios.' });
    setSaving(true); setMsg(null);
    try {
      const payload = { ...form, beneficios: form.beneficios.filter(b => b.trim()) };
      if (editing) await api.put(`/api/servicos/${editing}`, payload);
      else         await api.post('/api/servicos', payload);
      setMsg({ type: 'success', text: `✅ Serviço ${editing ? 'atualizado' : 'criado'}!` });
      setShowForm(false); load();
    } catch { setMsg({ type: 'error', text: '❌ Erro ao salvar.' }); }
    finally { setSaving(false); }
  };

  const handleDelete   = async (id: string)     => { if (!confirm('Excluir?')) return; await api.delete(`/api/servicos/${id}`); load(); };
  const toggleAtivo    = async (s: Servico)      => { await api.put(`/api/servicos/${s.id}`, { ativo: !s.ativo }); load(); };
  const updateBeneficio = (i: number, val: string) => { const b = [...form.beneficios]; b[i] = val; setForm({ ...form, beneficios: b }); };
  const addBeneficio   = () => setForm({ ...form, beneficios: [...form.beneficios, ''] });
  const removeBeneficio = (i: number) => setForm({ ...form, beneficios: form.beneficios.filter((_, idx) => idx !== i) });

  return (
    <AdminLayout title="Serviços">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-[#999] text-sm">{servicos.length} serviço(s) cadastrado(s)</p>
        <button onClick={openNew}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355]
            text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition w-full sm:w-auto">
          <Plus className="w-5 h-5" /> Novo Serviço
        </button>
      </div>

      {msg && <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}

      {/* Modal — full-screen mobile */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto">
          <div className="bg-white w-full sm:rounded-3xl sm:max-w-2xl sm:my-6 min-h-screen sm:min-h-0">
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-5 py-4 border-b border-[#F5F1EB] sm:rounded-t-3xl">
              <h3 className="text-lg font-bold text-[#5D4E37]">{editing ? 'Editar' : 'Novo'} Serviço</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F1EB] rounded-xl transition">
                <X className="w-5 h-5 text-[#999]" />
              </button>
            </div>
            <div className="p-5 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Ícone (emoji)</label>
                  <input type="text" value={form.icone} onChange={e => setForm({ ...form, icone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-2xl text-center" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Título</label>
                  <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Descrição</label>
                <textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} rows={3}
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-[#5D4E37]">Benefícios</label>
                  <button onClick={addBeneficio} className="text-xs text-[#D4AF7A] font-semibold hover:text-[#8B7355]">+ Adicionar</button>
                </div>
                {form.beneficios.map((b, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" value={b} onChange={e => updateBeneficio(i, e.target.value)} placeholder={`Benefício ${i + 1}`}
                      className="flex-1 px-4 py-2.5 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-sm" />
                    <button onClick={() => removeBeneficio(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl flex-shrink-0"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Duração', key: 'duracao', placeholder: '60 min' },
                  { label: 'Preço',   key: 'preco',   placeholder: 'Consulte' },
                  { label: 'Ordem',   key: 'ordem',   placeholder: '0', type: 'number' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'ordem' ? 'col-span-2 sm:col-span-1' : ''}>
                    <label className="block text-sm font-semibold text-[#5D4E37] mb-2">{f.label}</label>
                    <input type={f.type || 'text'} value={(form as any)[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                      className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3.5 border-2 border-[#F5F1EB] rounded-xl font-semibold text-[#999] hover:border-[#D4AF7A] transition">Cancelar</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicos.map(s => (
            <div key={s.id} className={`bg-white rounded-2xl p-5 shadow-md border-2 ${s.ativo ? 'border-[#F5F1EB]' : 'border-red-100 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{s.icone}</span>
                <div className="flex gap-1">
                  <button onClick={() => toggleAtivo(s)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg" title={s.ativo ? 'Desativar' : 'Ativar'}>
                    {s.ativo ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-[#999]" />}
                  </button>
                  <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg"><Pencil className="w-4 h-4 text-[#D4AF7A]" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
              <h4 className="font-bold text-[#5D4E37] mb-1 text-sm sm:text-base">{s.titulo}</h4>
              <p className="text-xs text-[#999] mb-3 line-clamp-2">{s.descricao}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-[#F5F1EB] px-2 py-1 rounded-lg text-[#666]">{s.duracao}</span>
                <span className="bg-[#F5F1EB] px-2 py-1 rounded-lg text-[#666]">{s.preco}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default ServicosAdmin;