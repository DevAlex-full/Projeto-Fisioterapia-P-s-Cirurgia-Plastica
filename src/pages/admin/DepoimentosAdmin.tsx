import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Save, X, Loader, Star, ToggleLeft, ToggleRight } from 'lucide-react';

interface Depoimento { id: string; nome: string; procedimento: string; texto: string; rating: number; fotoUrl: string | null; ordem: number; ativo: boolean; }
const empty = { nome: '', procedimento: '', texto: '', rating: 5, fotoUrl: '', ordem: 0 };

const DepoimentosAdmin = () => {
  const [items, setItems] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => { const { data } = await api.get('/api/depoimentos/all'); setItems(data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openEdit = (d: Depoimento) => {
    setForm({ nome: d.nome, procedimento: d.procedimento, texto: d.texto, rating: d.rating, fotoUrl: d.fotoUrl || '', ordem: d.ordem });
    setEditing(d.id); setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      if (editing) await api.put(`/api/depoimentos/${editing}`, form);
      else await api.post('/api/depoimentos', form);
      setMsg({ type: 'success', text: `✅ Depoimento ${editing ? 'atualizado' : 'criado'}!` });
      setShowForm(false); load();
    } catch { setMsg({ type: 'error', text: '❌ Erro ao salvar.' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('Excluir?')) return; await api.delete(`/api/depoimentos/${id}`); load(); };
  const toggleAtivo = async (d: Depoimento) => { await api.put(`/api/depoimentos/${d.id}`, { ativo: !d.ativo }); load(); };

  return (
    <AdminLayout title="Depoimentos">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#999] text-sm">{items.length} depoimento(s)</p>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
          <Plus className="w-5 h-5" /> Novo Depoimento
        </button>
      </div>
      {msg && <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#5D4E37]">{editing ? 'Editar' : 'Novo'} Depoimento</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F1EB] rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {/* Mini preview do card */}
              <div className="bg-[#F5F1EB] rounded-2xl p-4 flex gap-3 items-start">
                {form.fotoUrl
                  ? <img src={form.fotoUrl} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  : <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex-shrink-0 flex items-center justify-center text-white font-bold text-lg">{form.nome?.[0] || '?'}</div>}
                <div>
                  <p className="font-bold text-[#5D4E37] text-sm">{form.nome || 'Nome do paciente'}</p>
                  <p className="text-xs text-[#D4AF7A]">{form.procedimento || 'Procedimento'}</p>
                  <div className="flex gap-0.5 my-1">{[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= form.rating ? 'text-[#D4AF7A] fill-current' : 'text-[#ddd]'}`} />)}</div>
                  <p className="text-xs text-[#666] line-clamp-2">"{form.texto || 'Depoimento aqui...'}"</p>
                </div>
              </div>

              <ImageUpload label="Foto do Paciente" value={form.fotoUrl} onChange={(url) => setForm(f => ({ ...f, fotoUrl: url }))} previewH="h-36" />

              {([{ key: 'nome', label: 'Nome do Paciente' }, { key: 'procedimento', label: 'Procedimento Realizado' }] as const).map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">{f.label}</label>
                  <input type="text" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Depoimento</label>
                <textarea value={form.texto} onChange={e => setForm({ ...form, texto: e.target.value })} rows={4}
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Avaliação</label>
                  <div className="flex gap-1">{[1,2,3,4,5].map(n => (<button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}><Star className={`w-8 h-8 ${n <= form.rating ? 'text-[#D4AF7A] fill-current' : 'text-[#ddd]'}`} /></button>))}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Ordem</label>
                  <input type="number" value={form.ordem} onChange={e => setForm({ ...form, ordem: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 border-2 border-[#F5F1EB] rounded-xl font-semibold text-[#999]">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" /></div> : (
        <div className="space-y-4">
          {items.map(d => (
            <div key={d.id} className={`bg-white rounded-2xl p-5 shadow-md border-2 flex gap-4 ${d.ativo ? 'border-[#F5F1EB]' : 'border-red-100 opacity-60'}`}>
              {d.fotoUrl
                ? <img src={d.fotoUrl} alt={d.nome} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                : <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex-shrink-0 flex items-center justify-center text-white font-bold text-xl">{d.nome?.[0]}</div>}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-[#5D4E37]">{d.nome}</p>
                    <p className="text-xs text-[#D4AF7A] font-medium">{d.procedimento}</p>
                    <div className="flex gap-0.5 my-1">{[...Array(d.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-[#D4AF7A] fill-current" />)}</div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => toggleAtivo(d)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg">{d.ativo ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-[#999]" />}</button>
                    <button onClick={() => openEdit(d)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg"><Pencil className="w-4 h-4 text-[#D4AF7A]" /></button>
                    <button onClick={() => handleDelete(d.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </div>
                <p className="text-sm text-[#666] line-clamp-2 mt-1">"{d.texto}"</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default DepoimentosAdmin;