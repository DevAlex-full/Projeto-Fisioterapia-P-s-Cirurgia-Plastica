import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';
import {
  Plus, Pencil, Trash2, Save, X, Loader,
  ToggleLeft, ToggleRight, Star, StarOff,
  Filter, Image, Play, GalleryHorizontal
} from 'lucide-react';

interface Midia {
  id: string; titulo: string; descricao: string; url: string;
  tipo: string; categoria: string; ordem: number; destaque: boolean; ativo: boolean;
}

const CATEGORIAS = [
  { value: 'todos',      label: 'Todos' },
  { value: 'geral',      label: 'Geral' },
  { value: 'resultados', label: 'Resultados' },
  { value: 'clinica',    label: 'Clínica' },
  { value: 'instagram',  label: 'Instagram' },
];

const emptyForm = {
  titulo: '', descricao: '', url: '',
  tipo: 'image', categoria: 'geral', ordem: 0, destaque: false,
};

const GaleriaAdmin = () => {
  const [midias,   setMidias]   = useState<Midia[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<string | null>(null);
  const [form,     setForm]     = useState(emptyForm);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filtro,   setFiltro]   = useState('todos');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    try {
      const { data } = await api.get('/api/midia/all');
      setMidias(data);
    } catch { setMidias([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ ...emptyForm, ordem: midias.length + 1 });
    setEditing(null); setShowForm(true);
  };

  const openEdit = (m: Midia) => {
    setForm({
      titulo: m.titulo, descricao: m.descricao ?? '', url: m.url,
      tipo: m.tipo, categoria: m.categoria, ordem: m.ordem, destaque: m.destaque,
    });
    setEditing(m.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.titulo.trim() || !form.url) {
      setMsg({ type: 'error', text: 'Título e imagem são obrigatórios.' }); return;
    }
    setSaving(true); setMsg(null);
    try {
      if (editing) await api.put(`/api/midia/${editing}`, form);
      else         await api.post('/api/midia', form);
      setMsg({ type: 'success', text: `✅ Mídia ${editing ? 'atualizada' : 'adicionada'}!` });
      setShowForm(false); load();
    } catch {
      setMsg({ type: 'error', text: '❌ Erro ao salvar.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta mídia?')) return;
    setDeleting(id);
    try { await api.delete(`/api/midia/${id}`); load(); }
    finally { setDeleting(null); }
  };

  const toggleAtivo    = async (m: Midia) => { await api.put(`/api/midia/${m.id}`, { ativo: !m.ativo });      load(); };
  const toggleDestaque = async (m: Midia) => { await api.put(`/api/midia/${m.id}`, { destaque: !m.destaque }); load(); };

  const lista = filtro === 'todos' ? midias : midias.filter(m => m.categoria === filtro);

  return (
    <AdminLayout title="Galeria de Mídia">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-[#999] text-sm">
          {lista.length} item(s) · {midias.filter(m => m.destaque).length} em destaque
        </p>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355]
            text-white px-5 py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" /> Adicionar Mídia
        </button>
      </div>

      {/* Mensagem */}
      {msg && (
        <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${
          msg.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>{msg.text}</div>
      )}

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-[#999] flex-shrink-0" />
        {CATEGORIAS.map(c => (
          <button key={c.value} onClick={() => setFiltro(c.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              filtro === c.value
                ? 'bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white shadow'
                : 'bg-white text-[#8B7355] border-2 border-[#F5F1EB] hover:border-[#D4AF7A]'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* ── MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full sm:rounded-3xl sm:max-w-lg min-h-screen sm:min-h-0 sm:my-4">

            {/* Modal header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-[#F5F1EB] sm:rounded-t-3xl">
              <h3 className="text-lg font-bold text-[#5D4E37]">
                {editing ? 'Editar' : 'Nova'} Mídia
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F1EB] rounded-xl">
                <X className="w-5 h-5 text-[#999]" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Upload */}
              <ImageUpload
                label="Imagem ou Vídeo"
                value={form.url}
                onChange={url => setForm(f => ({ ...f, url, tipo: url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image' }))}
                accept="image/*,video/*"
                previewH="h-52"
              />

              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Título *</label>
                <input type="text" value={form.titulo}
                  onChange={e => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: Resultado Drenagem Linfática"
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-sm" />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Descrição (opcional)</label>
                <textarea value={form.descricao}
                  onChange={e => setForm({ ...form, descricao: e.target.value })} rows={2}
                  placeholder="Breve descrição..."
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-sm resize-none" />
              </div>

              {/* Tipo + Categoria + Ordem */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'tipo',      label: 'Tipo',      opts: [{ v:'image',  l:'Imagem' }, { v:'video', l:'Vídeo'  }] },
                  { key: 'categoria', label: 'Categoria', opts: CATEGORIAS.filter(c=>c.value!=='todos').map(c=>({ v:c.value, l:c.label })) },
                ].map(f => (
                  <div key={f.key} className="col-span-1">
                    <label className="block text-xs font-semibold text-[#5D4E37] mb-1.5">{f.label}</label>
                    <select value={(form as any)[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-xs">
                      {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-[#5D4E37] mb-1.5">Ordem</label>
                  <input type="number" value={form.ordem}
                    onChange={e => setForm({ ...form, ordem: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-xs" />
                </div>
              </div>

              {/* Destaque toggle */}
              <div className="flex items-center justify-between bg-[#F5F1EB] px-4 py-3.5 rounded-2xl">
                <div>
                  <p className="font-semibold text-[#5D4E37] text-sm">Marcar como Destaque</p>
                  <p className="text-xs text-[#999]">Aparece na galeria principal do site</p>
                </div>
                <button
                  onClick={() => setForm(f => ({ ...f, destaque: !f.destaque }))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    form.destaque ? 'bg-[#D4AF7A]' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                    form.destaque ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-3.5 border-2 border-[#F5F1EB] rounded-xl font-semibold text-[#999] hover:border-[#D4AF7A] transition text-sm">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:shadow-lg transition">
                  {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GRID ── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" />
        </div>
      ) : lista.length === 0 ? (
        <div className="text-center py-20">
          <GalleryHorizontal className="w-14 h-14 mx-auto mb-3 text-[#E8E0D5]" />
          <p className="font-semibold text-[#bbb]">Nenhuma mídia encontrada</p>
          <p className="text-xs text-[#ccc] mt-1">Clique em "Adicionar Mídia" para começar</p>
          <button onClick={openNew}
            className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition">
            <Plus className="w-4 h-4" /> Adicionar primeira mídia
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {lista.map(m => (
            <div key={m.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-md border-2 transition-all ${
                m.ativo   ? 'border-[#F5F1EB]' : 'border-red-100 opacity-60'
              } ${m.destaque ? 'ring-2 ring-[#D4AF7A]' : ''}`}>

              {/* Thumbnail */}
              <div className="relative aspect-square bg-[#F5F1EB] overflow-hidden group">
                {m.tipo === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-[#D4AF7A]" />
                  </div>
                ) : (
                  <img src={m.url} alt={m.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
                {m.destaque && (
                  <span className="absolute top-1.5 left-1.5 bg-[#D4AF7A] text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow">
                    ⭐ Destaque
                  </span>
                )}
                <span className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  {m.tipo === 'video' ? '▶' : '🖼'}
                </span>
              </div>

              {/* Info + Ações */}
              <div className="p-2.5">
                <p className="font-bold text-[#5D4E37] text-xs truncate">{m.titulo}</p>
                <span className="text-[10px] bg-[#F5F1EB] text-[#8B7355] px-2 py-0.5 rounded-full font-semibold capitalize mt-1 inline-block">
                  {m.categoria}
                </span>
                <div className="flex items-center gap-0.5 mt-2 pt-2 border-t border-[#F5F1EB]">
                  <button onClick={() => toggleDestaque(m)} title={m.destaque ? 'Remover destaque' : 'Destacar'}
                    className="p-1.5 hover:bg-[#F5F1EB] rounded-lg transition flex-1 flex justify-center">
                    {m.destaque
                      ? <StarOff className="w-3.5 h-3.5 text-[#D4AF7A]" />
                      : <Star    className="w-3.5 h-3.5 text-[#ccc]"     />}
                  </button>
                  <button onClick={() => toggleAtivo(m)} title={m.ativo ? 'Desativar' : 'Ativar'}
                    className="p-1.5 hover:bg-[#F5F1EB] rounded-lg transition flex-1 flex justify-center">
                    {m.ativo
                      ? <ToggleRight className="w-3.5 h-3.5 text-green-500" />
                      : <ToggleLeft  className="w-3.5 h-3.5 text-[#ccc]"    />}
                  </button>
                  <button onClick={() => openEdit(m)}
                    className="p-1.5 hover:bg-[#F5F1EB] rounded-lg transition flex-1 flex justify-center">
                    <Pencil className="w-3.5 h-3.5 text-[#D4AF7A]" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} disabled={deleting === m.id}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition flex-1 flex justify-center disabled:opacity-50">
                    {deleting === m.id
                      ? <Loader  className="w-3.5 h-3.5 text-red-400 animate-spin" />
                      : <Trash2  className="w-3.5 h-3.5 text-red-400" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default GaleriaAdmin;