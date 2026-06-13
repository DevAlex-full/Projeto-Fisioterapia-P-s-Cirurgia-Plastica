import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Save, X, Loader, ToggleLeft, ToggleRight, Play, Image } from 'lucide-react';

interface Post { id: string; url: string; mediaUrl: string; tipo: string; posterUrl: string | null; legenda: string | null; ordem: number; ativo: boolean; }
const empty = { url: '', mediaUrl: '', tipo: 'image', posterUrl: '', legenda: '', ordem: 0 };

const InstagramAdmin = () => {
  const [items,    setItems]    = useState<Post[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<string | null>(null);
  const [form,     setForm]     = useState(empty);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      else         await api.post('/api/instagram', form);
      setMsg({ type: 'success', text: '✅ Post salvo!' });
      setShowForm(false); load();
    } catch { setMsg({ type: 'error', text: '❌ Erro ao salvar.' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('Excluir?')) return; await api.delete(`/api/instagram/${id}`); load(); };
  const toggleAtivo  = async (p: Post)    => { await api.put(`/api/instagram/${p.id}`, { ativo: !p.ativo }); load(); };

  return (
    <AdminLayout title="Posts do Instagram">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-[#999] text-sm">{items.length} post(s)</p>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355]
            text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition w-full sm:w-auto">
          <Plus className="w-5 h-5" /> Novo Post
        </button>
      </div>

      {msg && <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}

      {/* Modal — full-screen mobile */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto">
          <div className="bg-white w-full sm:rounded-3xl sm:max-w-xl sm:my-6 min-h-screen sm:min-h-0">
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-5 py-4 border-b border-[#F5F1EB] sm:rounded-t-3xl">
              <h3 className="text-lg font-bold text-[#5D4E37]">{editing ? 'Editar' : 'Novo'} Post</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F1EB] rounded-xl transition">
                <X className="w-5 h-5 text-[#999]" />
              </button>
            </div>
            <div className="p-5 sm:p-8 space-y-4">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Tipo de Mídia</label>
                <div className="grid grid-cols-2 gap-3">
                  {['image', 'video'].map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, tipo: t })}
                      className={`py-3 rounded-xl font-semibold border-2 flex items-center justify-center gap-2 transition ${
                        form.tipo === t ? 'border-[#D4AF7A] bg-[#D4AF7A]/10 text-[#5D4E37]' : 'border-[#F5F1EB] text-[#999]'
                      }`}>
                      {t === 'image' ? <><Image className="w-4 h-4" /> Imagem</> : <><Play className="w-4 h-4" /> Vídeo</>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload mídia ou thumbnail */}
              <ImageUpload
                label={form.tipo === 'image' ? 'Imagem do Post' : 'Thumbnail do Vídeo (capa)'}
                value={form.tipo === 'image' ? form.mediaUrl : form.posterUrl}
                onChange={url => form.tipo === 'image'
                  ? setForm(f => ({ ...f, mediaUrl: url }))
                  : setForm(f => ({ ...f, posterUrl: url }))
                }
                accept={form.tipo === 'image' ? 'image/*' : 'image/*'}
                previewH="h-52"
              />

              {/* URL do vídeo */}
              {form.tipo === 'video' && (
                <div>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">URL do Vídeo (.mp4)</label>
                  <input type="text" value={form.mediaUrl} onChange={e => setForm({ ...form, mediaUrl: e.target.value })}
                    placeholder="https://... .mp4"
                    className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-sm" />
                </div>
              )}

              {/* URL Instagram */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">URL do Post no Instagram</label>
                <input type="text" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                  placeholder="https://instagram.com/p/..."
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-sm" />
              </div>

              {/* Legenda + Ordem */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Legenda (opcional)</label>
                <textarea value={form.legenda} onChange={e => setForm({ ...form, legenda: e.target.value })} rows={2}
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none text-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Ordem</label>
                <input type="number" value={form.ordem} onChange={e => setForm({ ...form, ordem: Number(e.target.value) })}
                  className="w-28 px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {items.map(p => (
            <div key={p.id} className={`bg-white rounded-2xl overflow-hidden shadow-md border-2 ${p.ativo ? 'border-[#F5F1EB]' : 'border-red-100 opacity-60'}`}>
              <div className="relative aspect-square bg-[#F5F1EB]">
                {p.tipo === 'video'
                  ? <video src={p.mediaUrl} poster={p.posterUrl || undefined} className="w-full h-full object-cover" muted playsInline />
                  : <img src={p.mediaUrl} alt={p.legenda || ''} className="w-full h-full object-cover" />}
                <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                  {p.tipo === 'video' ? '🎬' : '📷'}
                </span>
              </div>
              <div className="p-2.5 sm:p-3 flex items-center justify-between gap-1">
                <span className="text-xs text-[#999] font-medium">#{p.ordem}</span>
                <div className="flex gap-0.5">
                  <button onClick={() => toggleAtivo(p)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg">
                    {p.ativo ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-[#999]" />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg"><Pencil className="w-4 h-4 text-[#D4AF7A]" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
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