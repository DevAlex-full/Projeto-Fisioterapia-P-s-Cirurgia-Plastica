import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Save, X, Loader, ToggleLeft, ToggleRight } from 'lucide-react';

interface FAQ { id: string; pergunta: string; resposta: string; ordem: number; ativo: boolean; }
const empty = { pergunta: '', resposta: '', ordem: 0 };

const FaqAdmin = () => {
  const [items,    setItems]    = useState<FAQ[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<string | null>(null);
  const [form,     setForm]     = useState(empty);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => { const { data } = await api.get('/api/faq/all'); setItems(data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openEdit = (f: FAQ) => { setForm({ pergunta: f.pergunta, resposta: f.resposta, ordem: f.ordem }); setEditing(f.id); setShowForm(true); };

  const handleSave = async () => {
    if (!form.pergunta.trim()) return setMsg({ type: 'error', text: 'Pergunta é obrigatória.' });
    setSaving(true); setMsg(null);
    try {
      if (editing) await api.put(`/api/faq/${editing}`, form);
      else         await api.post('/api/faq', form);
      setMsg({ type: 'success', text: `✅ FAQ ${editing ? 'atualizado' : 'criado'}!` });
      setShowForm(false); load();
    } catch { setMsg({ type: 'error', text: '❌ Erro ao salvar.' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('Excluir este FAQ?')) return; await api.delete(`/api/faq/${id}`); load(); };
  const toggleAtivo  = async (f: FAQ)      => { await api.put(`/api/faq/${f.id}`, { ativo: !f.ativo }); load(); };

  return (
    <AdminLayout title="Perguntas Frequentes">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-[#999] text-sm">{items.length} pergunta(s) cadastrada(s)</p>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355]
            text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition w-full sm:w-auto">
          <Plus className="w-5 h-5" /> Nova Pergunta
        </button>
      </div>

      {msg && <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}

      {/* Modal — full-screen no mobile */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto">
          <div className="bg-white w-full sm:rounded-3xl sm:max-w-xl sm:my-6 min-h-screen sm:min-h-0">
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-5 py-4 border-b border-[#F5F1EB] sm:rounded-t-3xl">
              <h3 className="text-lg font-bold text-[#5D4E37]">{editing ? 'Editar' : 'Nova'} Pergunta</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F1EB] rounded-xl transition">
                <X className="w-5 h-5 text-[#999]" />
              </button>
            </div>
            <div className="p-5 sm:p-8 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Pergunta</label>
                <input type="text" value={form.pergunta} onChange={e => setForm({ ...form, pergunta: e.target.value })}
                  placeholder="Ex: Quando devo iniciar a fisioterapia?"
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Resposta</label>
                <textarea value={form.resposta} onChange={e => setForm({ ...form, resposta: e.target.value })} rows={5}
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Ordem</label>
                <input type="number" value={form.ordem} onChange={e => setForm({ ...form, ordem: Number(e.target.value) })}
                  className="w-32 px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
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

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((f, i) => (
            <div key={f.id} className={`bg-white rounded-2xl p-4 sm:p-5 shadow-md border-2 ${f.ativo ? 'border-[#F5F1EB]' : 'border-red-100 opacity-60'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#D4AF7A] leading-none flex-shrink-0 mt-0.5">Q{i + 1}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#5D4E37] text-sm sm:text-base mb-1">{f.pergunta}</p>
                    <p className="text-xs sm:text-sm text-[#666] line-clamp-2">{f.resposta}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => toggleAtivo(f)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg">
                    {f.ativo ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-[#999]" />}
                  </button>
                  <button onClick={() => openEdit(f)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg"><Pencil className="w-4 h-4 text-[#D4AF7A]" /></button>
                  <button onClick={() => handleDelete(f.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default FaqAdmin;