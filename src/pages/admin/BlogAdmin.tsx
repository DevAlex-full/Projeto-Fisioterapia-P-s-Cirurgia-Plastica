import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Save, X, Loader, Eye, EyeOff } from 'lucide-react';

interface BlogPost { id: string; titulo: string; slug: string; excerpt: string; conteudo: string; imagemUrl: string | null; autor: string; readTime: string; publicado: boolean; destaque: boolean; tags: string[]; createdAt: string; }
const empty = { titulo: '', excerpt: '', conteudo: '', imagemUrl: '', autor: 'Débora Santiago', readTime: '5 min', publicado: false, destaque: false, tags: '' };

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => { const { data } = await api.get('/api/blog/all'); setPosts(data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openEdit = (p: BlogPost) => {
    setForm({ titulo: p.titulo, excerpt: p.excerpt, conteudo: p.conteudo, imagemUrl: p.imagemUrl || '', autor: p.autor, readTime: p.readTime, publicado: p.publicado, destaque: p.destaque, tags: p.tags.join(', ') });
    setEditing(p.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.titulo || !form.conteudo) return setMsg({ type: 'error', text: 'Título e conteúdo são obrigatórios.' });
    setSaving(true); setMsg(null);
    try {
      const payload = { ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) };
      if (editing) await api.put(`/api/blog/${editing}`, payload);
      else await api.post('/api/blog', payload);
      setMsg({ type: 'success', text: `✅ Post ${editing ? 'atualizado' : 'criado'}!` });
      setShowForm(false); load();
    } catch { setMsg({ type: 'error', text: '❌ Erro ao salvar.' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('Excluir?')) return; await api.delete(`/api/blog/${id}`); load(); };
  const togglePublicado = async (p: BlogPost) => { await api.put(`/api/blog/${p.id}`, { publicado: !p.publicado }); load(); };

  return (
    <AdminLayout title="Blog">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#999] text-sm">{posts.filter(p => p.publicado).length} publicado(s) / {posts.length} total</p>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
          <Plus className="w-5 h-5" /> Novo Post
        </button>
      </div>
      {msg && <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#5D4E37]">{editing ? 'Editar' : 'Novo'} Post</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F1EB] rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <ImageUpload label="Imagem de Capa" value={form.imagemUrl} onChange={(url) => setForm(f => ({ ...f, imagemUrl: url }))} previewH="h-52" />
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Título</label>
                <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Resumo / Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2}
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Conteúdo do Post</label>
                <textarea value={form.conteudo} onChange={e => setForm({ ...form, conteudo: e.target.value })} rows={10}
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none font-mono text-sm" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[{ key: 'autor', label: 'Autor' }, { key: 'readTime', label: 'Tempo de Leitura' }, { key: 'tags', label: 'Tags (vírgula)' }].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold text-[#5D4E37] mb-2">{f.label}</label>
                    <input type="text" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
                  </div>
                ))}
              </div>
              <div className="flex gap-6">
                {[{ key: 'publicado', label: '📢 Publicar agora' }, { key: 'destaque', label: '⭐ Post em destaque' }].map(opt => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={(form as any)[opt.key]} onChange={e => setForm({ ...form, [opt.key]: e.target.checked })} className="w-5 h-5 accent-[#D4AF7A]" />
                    <span className="text-sm font-medium text-[#5D4E37]">{opt.label}</span>
                  </label>
                ))}
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
          {posts.map(p => (
            <div key={p.id} className={`bg-white rounded-2xl p-5 shadow-md border-2 flex gap-4 ${p.publicado ? 'border-[#F5F1EB]' : 'border-yellow-100'}`}>
              {p.imagemUrl
                ? <img src={p.imagemUrl} alt={p.titulo} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                : <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex-shrink-0 flex items-center justify-center text-2xl">📝</div>}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-bold text-[#5D4E37] truncate">{p.titulo}</h4>
                      {p.destaque && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex-shrink-0">⭐ Destaque</span>}
                    </div>
                    <p className="text-xs text-[#999] mb-1">{p.autor} · {p.readTime} · {new Date(p.createdAt).toLocaleDateString('pt-BR')}</p>
                    <p className="text-sm text-[#666] line-clamp-1">{p.excerpt}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => togglePublicado(p)} title={p.publicado ? 'Despublicar' : 'Publicar'} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg">
                      {p.publicado ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-[#999]" />}
                    </button>
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg"><Pencil className="w-4 h-4 text-[#D4AF7A]" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </div>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-2 font-medium ${p.publicado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {p.publicado ? '✅ Publicado' : '📝 Rascunho'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default BlogAdmin;