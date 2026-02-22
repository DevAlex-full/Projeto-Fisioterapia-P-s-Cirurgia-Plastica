import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Save, Loader } from 'lucide-react';

const ContatoAdmin = () => {
  const [form, setForm] = useState({
    telefone: '', whatsapp: '', email: '', instagram: '', instagramUrl: '',
    endereco: '', bairro: '', cidade: '', cep: '',
    horarioSemana: '', horarioSabado: '', mensagemWpp: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.get('/api/contato').then(({ data }) => {
      setForm({
        telefone: data.telefone || '', whatsapp: data.whatsapp || '',
        email: data.email || '', instagram: data.instagram || '',
        instagramUrl: data.instagramUrl || '', endereco: data.endereco || '',
        bairro: data.bairro || '', cidade: data.cidade || '', cep: data.cep || '',
        horarioSemana: data.horarioSemana || '', horarioSabado: data.horarioSabado || '',
        mensagemWpp: data.mensagemWpp || '',
      });
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      await api.put('/api/contato', form);
      setMsg({ type: 'success', text: '✅ Informações de contato atualizadas!' });
    } catch { setMsg({ type: 'error', text: '❌ Erro ao salvar.' }); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="Contato"><div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" /></div></AdminLayout>;

  const Field = ({ name, label, type = 'input' }: { name: string; label: string; type?: string }) => (
    <div>
      <label className="block text-sm font-semibold text-[#5D4E37] mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea name={name} value={form[name as keyof typeof form]} onChange={handleChange} rows={3}
          className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] resize-none text-[#333]" />
      ) : (
        <input type="text" name={name} value={form[name as keyof typeof form]} onChange={handleChange}
          className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-[#333]" />
      )}
    </div>
  );

  return (
    <AdminLayout title="Informações de Contato">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-[#F5F1EB]">
          <h2 className="text-xl font-bold text-[#5D4E37] mb-6">Editar Contato</h2>

          {msg && <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#999] uppercase tracking-wider mb-4">📞 Comunicação</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field name="telefone" label="Telefone (exibição)" />
                <Field name="whatsapp" label="WhatsApp (só números, ex: 5511...)" />
                <Field name="email" label="Email" />
                <Field name="instagram" label="Instagram (@usuário)" />
              </div>
              <div className="mt-4">
                <Field name="instagramUrl" label="URL do Instagram (link completo)" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#999] uppercase tracking-wider mb-4">📍 Endereço</h3>
              <div className="space-y-4">
                <Field name="endereco" label="Rua e Número" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field name="bairro" label="Bairro" />
                  <Field name="cidade" label="Cidade - Estado" />
                  <Field name="cep" label="CEP" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#999] uppercase tracking-wider mb-4">🕐 Horários</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field name="horarioSemana" label="Segunda a Sexta" />
                <Field name="horarioSabado" label="Sábado" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#999] uppercase tracking-wider mb-4">💬 WhatsApp</h3>
              <Field name="mensagemWpp" label="Mensagem padrão do WhatsApp" type="textarea" />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="mt-8 w-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-4 rounded-2xl font-bold hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <><Loader className="w-5 h-5 animate-spin" /> Salvando...</> : <><Save className="w-5 h-5" /> Salvar Alterações</>}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContatoAdmin;