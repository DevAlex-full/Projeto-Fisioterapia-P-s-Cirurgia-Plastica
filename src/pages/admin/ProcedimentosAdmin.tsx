import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import {
  Plus, Pencil, Trash2, Save, X, Loader,
  ToggleLeft, ToggleRight, GripVertical
} from 'lucide-react';

interface Procedimento {
  id: string;
  nome: string;
  ordem: number;
  ativo: boolean;
}

const ProcedimentosAdmin = () => {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const { data } = await api.get('/api/procedimentos/all');
      setProcedimentos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setNome('');
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (p: Procedimento) => {
    setNome(p.nome);
    setEditing(p.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!nome.trim()) return setMsg({ type: 'error', text: 'Nome é obrigatório.' });
    setSaving(true); setMsg(null);
    try {
      if (editing) {
        await api.put(`/api/procedimentos/${editing}`, { nome: nome.trim() });
        setMsg({ type: 'success', text: '✅ Procedimento atualizado!' });
      } else {
        const ordem = procedimentos.length + 1;
        await api.post('/api/procedimentos', { nome: nome.trim(), ordem });
        setMsg({ type: 'success', text: '✅ Procedimento criado!' });
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
    if (!confirm('Tem certeza que deseja excluir este procedimento?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/procedimentos/${id}`);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAtivo = async (p: Procedimento) => {
    await api.put(`/api/procedimentos/${p.id}`, { ativo: !p.ativo });
    load();
  };

  const ativos   = procedimentos.filter(p => p.ativo);
  const inativos = procedimentos.filter(p => !p.ativo);

  return (
    <AdminLayout title="Procedimentos">
      {/* Header — FIX: flex-wrap evita compressão do botão em mobile,
          e o botão ganha flex-shrink-0 + w-full no mobile para não quebrar texto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-[#999] text-sm">
            {ativos.length} ativo(s) · {inativos.length} inativo(s)
          </p>
          <p className="text-xs text-[#bbb] mt-0.5">
            Procedimentos cirúrgicos que aparecem nos formulários do site
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex-shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Novo Procedimento
        </button>
      </div>

      {/* Mensagem */}
      {msg && (
        <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${
          msg.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Modal — FIX: full-screen no mobile (era modal pequeno centralizado fixo,
          que em telas estreitas ficava com pouca margem e risco de overflow) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto">
          <div className="bg-white w-full sm:rounded-3xl sm:max-w-md sm:my-auto min-h-screen sm:min-h-0">
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-5 py-4 border-b border-[#F5F1EB] sm:rounded-t-3xl">
              <h3 className="text-lg font-bold text-[#5D4E37]">
                {editing ? 'Editar' : 'Novo'} Procedimento
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#F5F1EB] rounded-xl transition">
                <X className="w-5 h-5 text-[#999]" />
              </button>
            </div>

            <div className="p-5 sm:p-8">
              <label className="block text-sm font-semibold text-[#5D4E37] mb-2">
                Nome do Procedimento
              </label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="Ex: Abdominoplastia"
                autoFocus
                className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-[#333] mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3.5 border-2 border-[#F5F1EB] rounded-xl font-semibold text-[#999] hover:border-[#D4AF7A] transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista — FIX: em mobile, ações vão para uma linha separada abaixo do
          nome (em vez de ficarem espremidas ao lado), e o grip/número somem
          em telas muito estreitas para dar mais espaço ao texto. */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" />
        </div>
      ) : procedimentos.length === 0 ? (
        <div className="text-center py-20 text-[#999]">
          <GripVertical className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Nenhum procedimento cadastrado</p>
          <p className="text-sm mt-1">Clique em "Novo Procedimento" para começar</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-md border-2 border-[#F5F1EB] overflow-hidden">
          {procedimentos.map((p, i) => (
            <div
              key={p.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 transition-colors ${
                !p.ativo ? 'opacity-50 bg-gray-50' : 'hover:bg-[#F5F1EB]/50'
              } ${i !== 0 ? 'border-t border-[#F5F1EB]' : ''}`}
            >
              {/* Linha 1 (mobile) / único bloco (desktop): grip + número + nome + badge */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <GripVertical className="hidden sm:block w-4 h-4 text-[#ccc] flex-shrink-0" />

                <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#F5F1EB] rounded-lg flex items-center justify-center text-xs font-bold text-[#8B7355] flex-shrink-0">
                  {p.ordem}
                </span>

                <span className={`flex-1 min-w-0 font-semibold text-sm sm:text-base truncate ${p.ativo ? 'text-[#5D4E37]' : 'text-[#999] line-through'}`}>
                  {p.nome}
                </span>

                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${
                  p.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
                }`}>
                  {p.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              {/* Linha 2 (mobile) / ao lado (desktop): ações — touch target maior */}
              <div className="flex items-center justify-end gap-1.5 sm:gap-1 flex-shrink-0 sm:ml-2">
                <button
                  onClick={() => toggleAtivo(p)}
                  className="p-2.5 sm:p-2 hover:bg-[#F5F1EB] rounded-lg transition"
                  title={p.ativo ? 'Desativar' : 'Ativar'}
                >
                  {p.ativo
                    ? <ToggleRight className="w-5 h-5 text-green-500" />
                    : <ToggleLeft  className="w-5 h-5 text-[#999]" />
                  }
                </button>
                <button
                  onClick={() => openEdit(p)}
                  className="p-2.5 sm:p-2 hover:bg-[#F5F1EB] rounded-lg transition"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4 text-[#D4AF7A]" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="p-2.5 sm:p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                  title="Excluir"
                >
                  {deletingId === p.id
                    ? <Loader className="w-4 h-4 text-red-400 animate-spin" />
                    : <Trash2 className="w-4 h-4 text-red-400" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default ProcedimentosAdmin;