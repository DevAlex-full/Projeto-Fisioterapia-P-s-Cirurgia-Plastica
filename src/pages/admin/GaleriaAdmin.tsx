import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import {
  Plus, Pencil, Trash2, Save, X, Loader,
  ToggleLeft, ToggleRight, Upload, Image, Play,
  Star, StarOff, Filter
} from 'lucide-react';

interface Midia {
  id: string;
  titulo: string;
  descricao: string;
  url: string;
  tipo: string;
  categoria: string;
  ordem: number;
  destaque: boolean;
  ativo: boolean;
}

const empty = {
  titulo: '', descricao: '', url: '',
  tipo: 'image', categoria: 'geral', ordem: 0, destaque: false,
};

const categorias = [
  { value: 'todos',      label: 'Todos' },
  { value: 'geral',      label: 'Geral' },
  { value: 'resultados', label: 'Resultados' },
  { value: 'clinica',    label: 'Clínica' },
  { value: 'instagram',  label: 'Instagram' },
];

const GaleriaAdmin = () => {
  const [midias, setMidias]         = useState<Midia[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<string | null>(null);
  const [form, setForm]             = useState(empty);
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [uploadPct, setUploadPct]   = useState(0);
  const [msg, setMsg]               = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filtro, setFiltro]         = useState('todos');
  const inputRef                    = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const { data } = await api.get('/api/midia/all');
      setMidias(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ ...empty, ordem: midias.length + 1 });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (m: Midia) => {
    setForm({
      titulo: m.titulo, descricao: m.descricao ?? '', url: m.url,
      tipo: m.tipo, categoria: m.categoria,
      ordem: m.ordem, destaque: m.destaque,
    });
    setEditing(m.id);
    setShowForm(true);
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true); setUploadPct(0);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e: any) => {
          setUploadPct(Math.round((e.loaded * 100) / e.total));
        },
      });
      const isvideo = file.type.startsWith('video');
      setForm(f => ({ ...f, url: data.url, tipo: isvideo ? 'video' : 'image' }));
    } catch {
      setMsg({ type: 'error', text: '❌ Erro ao fazer upload.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.titulo || !form.url) return setMsg({ type: 'error', text: 'Título e URL são obrigatórios.' });
    setSaving(true); setMsg(null);
    try {
      if (editing) {
        await api.put(`/api/midia/${editing}`, form);
        setMsg({ type: 'success', text: '✅ Mídia atualizada!' });
      } else {
        await api.post('/api/midia', form);
        setMsg({ type: 'success', text: '✅ Mídia adicionada!' });
      }
      setShowForm(false);
      load();
    } catch {
      setMsg({ type: 'error', text: '❌ Erro ao salvar.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar esta mídia?')) return;
    await api.delete(`/api/midia/${id}`);
    load();
  };

  const toggleAtivo    = async (m: Midia) => { await api.put(`/api/midia/${m.id}`, { ativo: !m.ativo }); load(); };
  const toggleDestaque = async (m: Midia) => { await api.put(`/api/midia/${m.id}`, { destaque: !m.destaque }); load(); };

  const filtradas = filtro === 'todos' ? midias : midias.filter(m => m.categoria === filtro);

  return (
    <AdminLayout title="Galeria de Mídia">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-[#999] text-sm">{filtradas.length} item(s) · {midias.filter(m => m.destaque).length} em destaque</p>
        <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
          <Plus className="w-5 h-5" /> Adicionar Mídia
        </button>
      </div>

      {/* Mensagem */}
      {msg && (
        <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Filtros por categoria */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-[#999]" />
        {categorias.map(c => (
          <button
            key={c.value}
            onClick={() => setFiltro(c.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              filtro === c.value
                ? 'bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white shadow'
                : 'bg-white text-[#8B7355] border-2 border-[#F5F1EB] hover:border-[#D4AF7A]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#5D4E37]">{editing ? 'Editar' : 'Nova'} Mídia</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F1EB] rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Upload / URL */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Arquivo</label>
                {/* Preview */}
                {form.url && !uploading && (
                  <div className="relative h-40 rounded-2xl overflow-hidden border-2 border-[#F5F1EB] mb-3 group">
                    {form.tipo === 'video'
                      ? <video src={form.url} className="w-full h-full object-cover" />
                      : <img    src={form.url} className="w-full h-full object-cover" alt="preview" />
                    }
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button onClick={() => inputRef.current?.click()} className="bg-white text-[#5D4E37] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Trocar
                      </button>
                    </div>
                  </div>
                )}
                {/* Área de drop */}
                {!form.url && !uploading && (
                  <div
                    onClick={() => inputRef.current?.click()}
                    className="h-40 border-4 border-dashed border-[#D4AF7A]/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF7A] hover:bg-[#D4AF7A]/5 transition"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-xl flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-bold text-[#5D4E37]">Clique para selecionar</p>
                    <p className="text-xs text-[#999] mt-1">Imagem ou Vídeo</p>
                  </div>
                )}
                {/* Progresso */}
                {uploading && (
                  <div className="h-40 border-2 border-[#D4AF7A] rounded-2xl bg-[#F5F1EB] flex flex-col items-center justify-center">
                    <Loader className="w-8 h-8 text-[#D4AF7A] animate-spin mb-3" />
                    <p className="text-sm font-bold text-[#5D4E37]">Enviando... {uploadPct}%</p>
                    <div className="w-40 bg-white rounded-full h-2 mt-3">
                      <div className="h-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] rounded-full transition-all" style={{ width: `${uploadPct}%` }} />
                    </div>
                  </div>
                )}
                <input ref={inputRef} type="file" accept="image/*,video/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} className="hidden" />
                {/* URL manual */}
                <input
                  type="text"
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  placeholder="Ou cole a URL da mídia"
                  className="w-full mt-2 px-4 py-2.5 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-sm"
                />
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Título</label>
                <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Resultado Drenagem Linfática"
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A]" />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Descrição (opcional)</label>
                <textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} rows={2} placeholder="Descrição breve..."
                  className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none" />
              </div>

              {/* Tipo + Categoria + Ordem */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Tipo</label>
                  <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-3 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-sm">
                    <option value="image">Imagem</option>
                    <option value="video">Vídeo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Categoria</label>
                  <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}
                    className="w-full px-3 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-sm">
                    {categorias.filter(c => c.value !== 'todos').map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5D4E37] mb-2">Ordem</label>
                  <input type="number" value={form.ordem} onChange={e => setForm({ ...form, ordem: Number(e.target.value) })}
                    className="w-full px-3 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-sm" />
                </div>
              </div>

              {/* Destaque */}
              <div className="flex items-center justify-between bg-[#F5F1EB] px-5 py-4 rounded-2xl">
                <div>
                  <p className="font-semibold text-[#5D4E37] text-sm">Marcar como Destaque</p>
                  <p className="text-xs text-[#999]">Aparece na galeria principal do site</p>
                </div>
                <button
                  onClick={() => setForm({ ...form, destaque: !form.destaque })}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${form.destaque ? 'bg-[#D4AF7A]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${form.destaque ? 'translate-x-7' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 border-2 border-[#F5F1EB] rounded-xl font-semibold text-[#999] hover:border-[#D4AF7A] transition">Cancelar</button>
              <button onClick={handleSave} disabled={saving || uploading}
                className="flex-1 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de mídias */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" /></div>
      ) : filtradas.length === 0 ? (
        <div className="text-center py-20 text-[#999]">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Nenhuma mídia encontrada</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtradas.map(m => (
            <div key={m.id} className={`bg-white rounded-2xl overflow-hidden shadow-md border-2 transition-all ${m.ativo ? 'border-[#F5F1EB]' : 'border-red-100 opacity-60'} ${m.destaque ? 'ring-2 ring-[#D4AF7A]' : ''}`}>
              {/* Thumbnail */}
              <div className="relative h-44 bg-[#F5F1EB] group">
                {m.tipo === 'video'
                  ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-10 h-10 text-[#D4AF7A]" />
                    </div>
                  ) : (
                    <img src={m.url} alt={m.titulo} className="w-full h-full object-cover" />
                  )
                }
                {/* Badge destaque */}
                {m.destaque && (
                  <span className="absolute top-2 left-2 bg-[#D4AF7A] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                    ⭐ Destaque
                  </span>
                )}
                {/* Badge tipo */}
                <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                  {m.tipo === 'video' ? '▶ Vídeo' : '🖼 Imagem'}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-bold text-[#5D4E37] text-sm truncate">{m.titulo}</p>
                <p className="text-xs text-[#999] mt-0.5 truncate">{m.descricao || '—'}</p>
                <span className="inline-block mt-2 text-xs bg-[#F5F1EB] text-[#8B7355] px-2 py-0.5 rounded-full font-semibold capitalize">
                  {m.categoria}
                </span>

                {/* Ações */}
                <div className="flex gap-1 mt-3 pt-3 border-t border-[#F5F1EB]">
                  <button onClick={() => toggleDestaque(m)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg transition" title={m.destaque ? 'Remover destaque' : 'Destacar'}>
                    {m.destaque ? <StarOff className="w-4 h-4 text-[#D4AF7A]" /> : <Star className="w-4 h-4 text-[#999]" />}
                  </button>
                  <button onClick={() => toggleAtivo(m)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg transition" title={m.ativo ? 'Desativar' : 'Ativar'}>
                    {m.ativo ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-[#999]" />}
                  </button>
                  <button onClick={() => openEdit(m)} className="p-1.5 hover:bg-[#F5F1EB] rounded-lg transition">
                    <Pencil className="w-4 h-4 text-[#D4AF7A]" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition ml-auto">
                    <Trash2 className="w-4 h-4 text-red-400" />
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