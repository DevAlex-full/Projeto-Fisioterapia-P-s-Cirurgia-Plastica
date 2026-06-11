import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';
import {
  Plus, Pencil, Trash2, Save, X, Loader,
  Eye, EyeOff, Image, Type, GripVertical,
  ArrowUp, ArrowDown, Upload, CheckCircle
} from 'lucide-react';

// ── Tipos ──────────────────────────────────────────────────
type BlockType = 'text' | 'image';

interface Block {
  id:       string;
  type:     BlockType;
  content:  string; // texto ou URL da imagem
  caption:  string; // legenda (só imagem)
  uploading: boolean;
  progress:  number;
}

interface BlogPost {
  id: string; titulo: string; slug: string; excerpt: string;
  conteudo: string; imagemUrl: string | null; autor: string;
  readTime: string; publicado: boolean; destaque: boolean;
  tags: string[]; createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────
const uid = () => `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

const makeBlock = (type: BlockType = 'text'): Block => ({
  id: uid(), type, content: '', caption: '', uploading: false, progress: 0,
});

const blocksToHtml = (blocks: Block[]): string =>
  blocks
    .filter(b => b.content.trim())
    .map(b => {
      if (b.type === 'image') {
        const alt = b.caption ? ` alt="${b.caption}"` : '';
        const caption = b.caption
          ? `<p style="text-align:center;font-size:13px;color:#999;margin-top:8px;">${b.caption}</p>`
          : '';
        return `<img src="${b.content}"${alt} style="width:100%;border-radius:12px;margin:8px 0;" />${caption}`;
      }
      return b.content
        .split('\n')
        .filter(l => l.trim())
        .map(l => `<p>${l}</p>`)
        .join('');
    })
    .join('\n');

const htmlToBlocks = (html: string): Block[] => {
  if (!html?.trim()) return [makeBlock('text')];
  const parts = html.split(/(<img[^>]*\/>[\s\S]*?(?:<p[^>]*>.*?<\/p>)?)/gi);
  const blocks: Block[] = [];
  for (const part of parts) {
    if (!part.trim()) continue;
    if (part.match(/^<img/i)) {
      const src     = part.match(/src="([^"]+)"/i)?.[1] || '';
      const alt     = part.match(/alt="([^"]+)"/i)?.[1] || '';
      const caption = part.match(/<p[^>]*>(.*?)<\/p>/i)?.[1] || alt;
      if (src) blocks.push({ id: uid(), type: 'image', content: src, caption, uploading: false, progress: 0 });
    } else {
      const text = part.replace(/<\/p>\s*<p>/gi, '\n').replace(/<[^>]+>/g, '').trim();
      if (text) blocks.push({ id: uid(), type: 'text', content: text, caption: '', uploading: false, progress: 0 });
    }
  }
  return blocks.length ? blocks : [makeBlock('text')];
};

const emptyForm = {
  titulo: '', excerpt: '', imagemUrl: '',
  autor: 'Débora Santiago', readTime: '5 min',
  publicado: false, destaque: false, tags: '',
};

// ══════════════════════════════════════════════════════════
const BlogAdmin = () => {
  const [posts,    setPosts]    = useState<BlogPost[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<string | null>(null);
  const [form,     setForm]     = useState(emptyForm);
  const [blocks,   setBlocks]   = useState<Block[]>([makeBlock('text')]);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [preview,  setPreview]  = useState(false);
  const fileRefs   = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const load = async () => {
    const { data } = await api.get('/api/blog/all');
    setPosts(data); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  // ── Abrir formulário ──────────────────────────────────────
  const openNew = () => {
    setForm(emptyForm);
    setBlocks([makeBlock('text')]);
    setEditing(null);
    setShowForm(true);
    setPreview(false);
  };

  const openEdit = (p: BlogPost) => {
    setForm({
      titulo: p.titulo, excerpt: p.excerpt, imagemUrl: p.imagemUrl || '',
      autor: p.autor, readTime: p.readTime,
      publicado: p.publicado, destaque: p.destaque,
      tags: p.tags.join(', '),
    });
    setBlocks(htmlToBlocks(p.conteudo));
    setEditing(p.id);
    setShowForm(true);
    setPreview(false);
  };

  // ── Blocos ────────────────────────────────────────────────
  const addBlock = (type: BlockType, afterId?: string) => {
    const b = makeBlock(type);
    setBlocks(prev => {
      if (!afterId) return [...prev, b];
      const idx = prev.findIndex(x => x.id === afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, b);
      return next;
    });
  };

  const updateBlock = (id: string, patch: Partial<Block>) =>
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b));

  const removeBlock = (id: string) =>
    setBlocks(prev => prev.filter(b => b.id !== id));

  const moveBlock = (id: string, dir: 'up' | 'down') => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (dir === 'up'   && idx === 0)              return prev;
      if (dir === 'down' && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  // ── Upload de imagem no bloco ─────────────────────────────
  const uploadImage = async (id: string, file: File) => {
    updateBlock(id, { uploading: true, progress: 10 });
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e: any) => {
          const pct = Math.round((e.loaded * 100) / (e.total || 1));
          updateBlock(id, { progress: Math.max(10, pct) });
        },
      });
      updateBlock(id, { content: data.url, uploading: false, progress: 100 });
    } catch (e: any) {
      const err = e?.response?.data?.error || 'Erro no upload';
      updateBlock(id, { uploading: false, progress: 0 });
      setMsg({ type: 'error', text: `❌ ${err}` });
    }
  };

  // ── Salvar post ───────────────────────────────────────────
  const handleSave = async () => {
    if (!form.titulo.trim()) return setMsg({ type: 'error', text: 'Título é obrigatório.' });
    if (blocks.every(b => !b.content.trim())) return setMsg({ type: 'error', text: 'Adicione pelo menos um bloco de conteúdo.' });
    setSaving(true); setMsg(null);
    try {
      const payload = {
        ...form,
        conteudo: blocksToHtml(blocks),
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      };
      if (editing) await api.put(`/api/blog/${editing}`, payload);
      else         await api.post('/api/blog', payload);
      setMsg({ type: 'success', text: `✅ Post ${editing ? 'atualizado' : 'criado'}!` });
      setShowForm(false);
      load();
    } catch {
      setMsg({ type: 'error', text: '❌ Erro ao salvar.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete      = async (id: string) => { if (!confirm('Excluir este post?')) return; await api.delete(`/api/blog/${id}`); load(); };
  const togglePublicado   = async (p: BlogPost)  => { await api.put(`/api/blog/${p.id}`, { publicado: !p.publicado }); load(); };

  // ══════════════════════════════════════════════════════════
  return (
    <AdminLayout title="Blog">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#999] text-sm">
          {posts.filter(p => p.publicado).length} publicado(s) / {posts.length} total
        </p>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
          <Plus className="w-5 h-5" /> Novo Post
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${
          msg.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>{msg.text}</div>
      )}

      {/* ── MODAL EDITOR ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full sm:rounded-3xl sm:max-w-3xl min-h-screen sm:min-h-0 sm:my-4">

            {/* Modal header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-[#F5F1EB] sm:rounded-t-3xl">
              <h3 className="text-lg font-bold text-[#5D4E37]">
                {editing ? 'Editar' : 'Novo'} Post
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreview(!preview)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    preview
                      ? 'bg-[#D4AF7A] text-white'
                      : 'bg-[#F5F1EB] text-[#5D4E37] hover:bg-[#D4AF7A]/20'
                  }`}
                >
                  <Eye className="w-4 h-4" /> {preview ? 'Editar' : 'Preview'}
                </button>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F1EB] rounded-xl">
                  <X className="w-5 h-5 text-[#999]" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-8 space-y-5">

              {/* Metadados */}
              <ImageUpload
                label="Imagem de Capa"
                value={form.imagemUrl}
                onChange={url => setForm(f => ({ ...f, imagemUrl: url }))}
                previewH="h-48"
              />

              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Título *</label>
                <input type="text" value={form.titulo}
                  onChange={e => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: Club do Lipedema — Programa Completo"
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Resumo (aparece nos cards)</label>
                <textarea value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2}
                  placeholder="Breve descrição do post..."
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none" />
              </div>

              {/* ── EDITOR DE BLOCOS ── */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-3">
                  Conteúdo do Post
                </label>

                {!preview ? (
                  <div className="space-y-3 border-2 border-[#F5F1EB] rounded-2xl p-4 bg-[#FDFCFA]">
                    {blocks.map((block, idx) => (
                      <div key={block.id}
                        className="group relative bg-white rounded-2xl border-2 border-[#F5F1EB] hover:border-[#D4AF7A]/30 overflow-hidden transition">

                        {/* Toolbar do bloco */}
                        <div className="flex items-center gap-1 px-3 py-2 bg-[#F9F5EE] border-b border-[#F5F1EB]">
                          <GripVertical className="w-4 h-4 text-[#ccc]" />
                          <span className="text-xs font-bold text-[#999] uppercase tracking-wider flex-1">
                            {block.type === 'image' ? '🖼️ Imagem' : '✏️ Texto'} {idx + 1}
                          </span>
                          <button onClick={() => moveBlock(block.id, 'up')}
                            disabled={idx === 0}
                            className="p-1 hover:bg-[#F5F1EB] rounded disabled:opacity-30 transition">
                            <ArrowUp className="w-3.5 h-3.5 text-[#999]" />
                          </button>
                          <button onClick={() => moveBlock(block.id, 'down')}
                            disabled={idx === blocks.length - 1}
                            className="p-1 hover:bg-[#F5F1EB] rounded disabled:opacity-30 transition">
                            <ArrowDown className="w-3.5 h-3.5 text-[#999]" />
                          </button>
                          <button onClick={() => removeBlock(block.id)}
                            className="p-1 hover:bg-red-50 rounded transition">
                            <X className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>

                        {/* Conteúdo do bloco */}
                        <div className="p-3">
                          {block.type === 'text' ? (
                            <textarea
                              value={block.content}
                              onChange={e => updateBlock(block.id, { content: e.target.value })}
                              placeholder="Digite o texto aqui..."
                              rows={4}
                              className="w-full bg-transparent resize-none focus:outline-none text-[#444] text-sm leading-relaxed placeholder-[#ccc]"
                            />
                          ) : (
                            <div>
                              {/* Área de upload */}
                              {!block.content ? (
                                <div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={el => { if (el) fileRefs.current[block.id] = el; }}
                                    onChange={e => {
                                      const file = e.target.files?.[0];
                                      if (file) uploadImage(block.id, file);
                                      e.target.value = '';
                                    }}
                                  />
                                  {block.uploading ? (
                                    <div className="h-32 flex flex-col items-center justify-center gap-3">
                                      <Loader className="w-8 h-8 text-[#D4AF7A] animate-spin" />
                                      <div className="w-40 h-2 bg-[#F5F1EB] rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] transition-all"
                                          style={{ width: `${block.progress}%` }}
                                        />
                                      </div>
                                      <p className="text-xs text-[#999]">Enviando... {block.progress}%</p>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => fileRefs.current[block.id]?.click()}
                                      className="w-full h-32 border-4 border-dashed border-[#D4AF7A]/40 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#D4AF7A] hover:bg-[#D4AF7A]/5 transition cursor-pointer"
                                    >
                                      <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-xl flex items-center justify-center">
                                        <Upload className="w-5 h-5 text-white" />
                                      </div>
                                      <p className="text-sm font-bold text-[#5D4E37]">Toque para selecionar imagem</p>
                                      <p className="text-xs text-[#999]">JPG, PNG, WebP até 50MB</p>
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  {/* Preview da imagem */}
                                  <div className="relative group/img">
                                    <img
                                      src={block.content} alt={block.caption}
                                      className="w-full rounded-xl object-cover max-h-64"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 rounded-xl transition flex items-center justify-center gap-3 opacity-0 group-hover/img:opacity-100">
                                      <button
                                        onClick={() => { updateBlock(block.id, { content: '', progress: 0 }); }}
                                        className="bg-white text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold shadow"
                                      >
                                        Trocar imagem
                                      </button>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                      <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                                    </div>
                                  </div>
                                  {/* Legenda */}
                                  <input
                                    type="text"
                                    value={block.caption}
                                    onChange={e => updateBlock(block.id, { caption: e.target.value })}
                                    placeholder="Legenda da imagem (opcional)"
                                    className="w-full mt-2 px-3 py-2 bg-[#F9F5EE] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF7A] text-[#666]"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Botões adicionar bloco */}
                    <div className="flex gap-3 pt-2 justify-center">
                      <button
                        onClick={() => addBlock('text')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#F5F1EB] text-[#5D4E37] rounded-xl font-semibold text-sm hover:bg-[#D4AF7A]/20 transition"
                      >
                        <Type className="w-4 h-4 text-[#D4AF7A]" /> + Texto
                      </button>
                      <button
                        onClick={() => addBlock('image')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#F5F1EB] text-[#5D4E37] rounded-xl font-semibold text-sm hover:bg-[#D4AF7A]/20 transition"
                      >
                        <Image className="w-4 h-4 text-[#D4AF7A]" /> + Imagem
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── PREVIEW ── */
                  <div className="border-2 border-[#F5F1EB] rounded-2xl p-5 bg-white min-h-40 space-y-4">
                    <p className="text-xs text-[#999] font-bold uppercase tracking-wider mb-4 text-center">
                      — Preview do Conteúdo —
                    </p>
                    {blocks.map(b => (
                      b.type === 'image' && b.content ? (
                        <div key={b.id}>
                          <img src={b.content} alt={b.caption} className="w-full rounded-xl" />
                          {b.caption && <p className="text-center text-xs text-[#999] mt-2">{b.caption}</p>}
                        </div>
                      ) : b.type === 'text' && b.content ? (
                        <div key={b.id} className="text-[#444] text-sm leading-relaxed">
                          {b.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                      ) : null
                    ))}
                  </div>
                )}
              </div>

              {/* Metadados extras */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: 'autor',    label: 'Autor',            ph: 'Débora Santiago' },
                  { key: 'readTime', label: 'Tempo de Leitura', ph: '5 min' },
                  { key: 'tags',     label: 'Tags (vírgula)',    ph: 'lipedema, drenagem' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'tags' ? 'col-span-2 sm:col-span-1' : ''}>
                    <label className="block text-sm font-semibold text-[#5D4E37] mb-2">{f.label}</label>
                    <input type="text" value={(form as any)[f.key]} placeholder={f.ph}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-sm" />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-5">
                {[
                  { key: 'publicado', label: '📢 Publicar agora' },
                  { key: 'destaque',  label: '⭐ Destaque' },
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={(form as any)[opt.key]}
                      onChange={e => setForm({ ...form, [opt.key]: e.target.checked })}
                      className="w-5 h-5 accent-[#D4AF7A]" />
                    <span className="text-sm font-medium text-[#5D4E37]">{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-3.5 border-2 border-[#F5F1EB] rounded-xl font-semibold text-[#999] hover:border-[#D4AF7A] transition">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60 hover:shadow-lg transition">
                  {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {saving ? 'Salvando...' : 'Salvar Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LISTA DE POSTS ── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(p => (
            <div key={p.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 shadow-md border-2 flex gap-3 sm:gap-4 ${
                p.publicado ? 'border-[#F5F1EB]' : 'border-yellow-100'
              }`}>
              {/* Thumbnail */}
              {p.imagemUrl
                ? <img src={p.imagemUrl} alt={p.titulo} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0" />
                : <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex-shrink-0 flex items-center justify-center text-2xl">📝</div>
              }
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-bold text-[#5D4E37] text-sm sm:text-base truncate">{p.titulo}</h4>
                      {p.destaque && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex-shrink-0">⭐</span>}
                    </div>
                    <p className="text-xs text-[#999]">{p.autor} · {p.readTime} · {new Date(p.createdAt).toLocaleDateString('pt-BR')}</p>
                    <p className="text-xs sm:text-sm text-[#666] line-clamp-1 mt-1">{p.excerpt}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => togglePublicado(p)} title={p.publicado ? 'Despublicar' : 'Publicar'}
                      className="p-1.5 hover:bg-[#F5F1EB] rounded-lg transition">
                      {p.publicado
                        ? <Eye className="w-4 h-4 text-green-500" />
                        : <EyeOff className="w-4 h-4 text-[#999]" />}
                    </button>
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg transition">
                      <Pencil className="w-4 h-4 text-[#D4AF7A]" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-2 font-medium ${
                  p.publicado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
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