import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Save, X, Loader, ToggleLeft, ToggleRight, Play, Image } from 'lucide-react';

interface Post { id: string; url: string; mediaUrl: string; tipo: string; posterUrl: string | null; legenda: string | null; ordem: number; ativo: boolean; }
const empty = { url: '', mediaUrl: '', tipo: 'image', posterUrl: '', legenda: '', ordem: 0 };

const InstagramAdmin = () => {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => { const { data } = await api.get('/api/instagram/all'); setItems(data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openEdit = (p: Post) => {
    setForm({ url: p.url, mediaUrl: p.mediaUrl, tipo: p.tipo, posterUrl: p.posterUrl || '', legenda: p.legenda || '', ordem: p.ordem });
    setEditing(p.id); setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      if (editing) await api.put(`/api/instagram/${editing}`, form);
      else await api.post('/api/instagram', form);
      setMsg({ type: 'success', text: '✅ Post salvo!' });
      setShowForm(false); load();
    } catch { setMsg({ type: 'error', text: '❌ Erro ao salvar.' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('Excluir?')) return; await api.delete(`/api/instagram/${id}`); load(); };
  const toggleAtivo = async (p: Post) => { await api.put(`/api/instagram/${p.id}`, { ativo: !p.ativo }); load(); };

  return (
    <AdminLayout title="Posts do Instagram">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#999] text-sm">{items.length} post(s)</p>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
          <Plus className="w-5 h-5" /> Novo Post
        </button>
      </div>
      {msg && <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#5D4E37]">{editing ? 'Editar' : 'Novo'} Post</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F1EB] rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Tipo de Mídia</label>
                <div className="flex gap-3">
                  {['image', 'video'].map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, tipo: t })}
                      className={`flex-1 py-3 rounded-xl font-semibold border-2 flex items-center justify-center gap-2 transition ${form.tipo === t ? 'border-[#D4AF7A] bg-[#D4AF7A]/10 text-[#5D4E37]' : 'border-[#F5F1EB] text-[#999]'}`}>
                      {t === 'image' ? <><Image className="w-4 h-4" /> 📷 Imagem</> : <><Play className="w-4 h-4" /> 🎬 Vídeo</>}
                    </button>
                  ))}
                </div>
              </div>

              <ImageUpload
                label={form.tipo === 'image' ? 'Imagem do Post' : 'Thumbnail do Vídeo'}
                value={form.tipo === 'image' ? form.mediaUrl : form.posterUrl}
                onChange={(url) => form.tipo === 'image' ? setForm(f => ({ ...f, mediaUrl: url })) : setForm(f => ({ ...f, posterUrl: url }))}
                previewH="h-48"
              />

              {form.tipo === 'video' && (
                <div>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">URL do Vídeo (.mp4)</label>
                  <input type="text" value={form.mediaUrl} onChange={e => setForm({ ...form, mediaUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">URL do Post no Instagram</label>
                <input type="text" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://instagram.com/p/..."
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Legenda (opcional)</label>
                <textarea value={form.legenda} onChange={e => setForm({ ...form, legenda: e.target.value })} rows={2}
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Ordem</label>
                <input type="number" value={form.ordem} onChange={e => setForm({ ...form, ordem: Number(e.target.value) })}
                  className="w-32 px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(p => (
            <div key={p.id} className={`bg-white rounded-2xl overflow-hidden shadow-md border-2 ${p.ativo ? 'border-[#F5F1EB]' : 'border-red-100 opacity-60'}`}>
              <div className="relative aspect-square bg-[#F5F1EB]">
                {p.tipo === 'video'
                  ? <video src={p.mediaUrl} poster={p.posterUrl || undefined} className="w-full h-full object-cover" muted />
                  : <img src={p.mediaUrl} alt="" className="w-full h-full object-cover" />}
                <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{p.tipo === 'video' ? '🎬' : '📷'}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs text-[#999]">#{p.ordem}</span>
                <div className="flex gap-1">
                  <button onClick={() => toggleAtivo(p)} className="p-1 hover:bg-[#F5F1EB] rounded-lg">{p.ativo ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-[#999]" />}</button>
                  <button onClick={() => openEdit(p)} className="p-1 hover:bg-[#F5F1EB] rounded-lg"><Pencil className="w-4 h-4 text-[#D4AF7A]" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default InstagramAdmin;