import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';
import {
  Save, Loader, Palette, Globe, MessageCircle,
  BarChart2, Eye, EyeOff, Settings
} from 'lucide-react';

interface SiteSettings {
  nomeClinica: string;
  logoUrl: string;
  faviconUrl: string;
  corPrimaria: string;
  corSecundaria: string;
  corTexto: string;
  metaTitle: string;
  metaDesc: string;
  googleAnalytics: string;
  pixelFacebook: string;
  whatsappFloat: boolean;
  whatsappMsg: string;
}

const empty: SiteSettings = {
  nomeClinica: '', logoUrl: '', faviconUrl: '',
  corPrimaria: '#D4AF7A', corSecundaria: '#8B7355', corTexto: '#5D4E37',
  metaTitle: '', metaDesc: '',
  googleAnalytics: '', pixelFacebook: '',
  whatsappFloat: true, whatsappMsg: '',
};

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-[#F5F1EB]">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F5F1EB]">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-lg font-bold text-[#5D4E37]">{title}</h2>
    </div>
    {children}
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-semibold text-[#5D4E37] mb-2">{label}</label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-[#333] ${props.className ?? ''}`}
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full px-4 py-3 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#D4AF7A] text-[#333] resize-none"
  />
);

const SettingsAdmin = () => {
  const [form, setForm] = useState<SiteSettings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showGA, setShowGA] = useState(false);
  const [showPixel, setShowPixel] = useState(false);

  useEffect(() => {
    api.get('/api/settings').then(({ data }) => {
      setForm({
        nomeClinica:    data.nomeClinica    ?? '',
        logoUrl:        data.logoUrl        ?? '',
        faviconUrl:     data.faviconUrl     ?? '',
        corPrimaria:    data.corPrimaria    ?? '#D4AF7A',
        corSecundaria:  data.corSecundaria  ?? '#8B7355',
        corTexto:       data.corTexto       ?? '#5D4E37',
        metaTitle:      data.metaTitle      ?? '',
        metaDesc:       data.metaDesc       ?? '',
        googleAnalytics: data.googleAnalytics ?? '',
        pixelFacebook:  data.pixelFacebook  ?? '',
        whatsappFloat:  data.whatsappFloat  ?? true,
        whatsappMsg:    data.whatsappMsg    ?? '',
      });
      setLoading(false);
    });
  }, []);

  const set = (key: keyof SiteSettings, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      await api.put('/api/settings', form);
      setMsg({ type: 'success', text: '✅ Configurações salvas com sucesso!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setMsg({ type: 'error', text: '❌ Erro ao salvar configurações.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout title="Configurações do Site">
      <div className="flex justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-[#D4AF7A]" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Configurações do Site">
      {/* Alerta global */}
      {msg && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${
          msg.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {msg.text}
        </div>
      )}

      <div className="space-y-6">

        {/* ── IDENTIDADE ─────────────────────────────────── */}
        <Section icon={Settings} title="Identidade da Clínica">
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Nome da Clínica">
              <Input
                value={form.nomeClinica}
                onChange={e => set('nomeClinica', e.target.value)}
                placeholder="Ex: Débora Santiago Fisioterapia"
              />
            </Field>
            <div />
            <div>
              <ImageUpload
                label="Logo (aparece no admin e no site)"
                value={form.logoUrl}
                onChange={url => set('logoUrl', url)}
                previewH="h-32"
              />
            </div>
            <div>
              <ImageUpload
                label="Favicon (ícone da aba do browser)"
                value={form.faviconUrl}
                onChange={url => set('faviconUrl', url)}
                previewH="h-32"
              />
            </div>
          </div>
        </Section>

        {/* ── CORES ──────────────────────────────────────── */}
        <Section icon={Palette} title="Cores do Site">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { key: 'corPrimaria',   label: 'Cor Primária',   hint: 'Botões, destaques' },
              { key: 'corSecundaria', label: 'Cor Secundária', hint: 'Hover, gradientes' },
              { key: 'corTexto',      label: 'Cor do Texto',   hint: 'Títulos principais' },
            ].map(({ key, label, hint }) => (
              <Field key={key} label={label}>
                <div className="flex items-center gap-3 bg-[#F5F1EB] px-4 py-3 rounded-xl border-2 border-transparent focus-within:border-[#D4AF7A]">
                  <input
                    type="color"
                    value={form[key as keyof SiteSettings] as string}
                    onChange={e => set(key as keyof SiteSettings, e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#5D4E37]">
                      {(form[key as keyof SiteSettings] as string).toUpperCase()}
                    </p>
                    <p className="text-xs text-[#999]">{hint}</p>
                  </div>
                </div>
              </Field>
            ))}
          </div>

          {/* Preview das cores */}
          <div className="mt-6 p-5 rounded-2xl border-2 border-[#F5F1EB]">
            <p className="text-xs font-semibold text-[#999] mb-3 uppercase tracking-wider">Preview</p>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                style={{ background: `linear-gradient(to right, ${form.corPrimaria}, ${form.corSecundaria})` }}
                className="px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg"
              >
                Botão Primário
              </button>
              <button
                style={{ border: `2px solid ${form.corPrimaria}`, color: form.corPrimaria }}
                className="px-5 py-2.5 rounded-xl font-bold text-sm"
              >
                Botão Secundário
              </button>
              <span style={{ color: form.corTexto }} className="font-bold text-lg">
                Título de Exemplo
              </span>
            </div>
          </div>
        </Section>

        {/* ── SEO ────────────────────────────────────────── */}
        <Section icon={Globe} title="SEO & Metadados">
          <div className="space-y-4">
            <Field label="Meta Title (título na aba do navegador e no Google)">
              <Input
                value={form.metaTitle}
                onChange={e => set('metaTitle', e.target.value)}
                placeholder="Ex: Débora Santiago | Fisioterapia Pós-Operatória em SP"
                maxLength={60}
              />
              <p className="text-xs text-[#999] mt-1">{form.metaTitle.length}/60 caracteres recomendados</p>
            </Field>
            <Field label="Meta Description (descrição no Google)">
              <Textarea
                value={form.metaDesc}
                onChange={e => set('metaDesc', e.target.value)}
                rows={3}
                placeholder="Ex: Fisioterapia especializada em pós-operatório de cirurgias plásticas em São Paulo..."
                maxLength={160}
              />
              <p className="text-xs text-[#999] mt-1">{form.metaDesc.length}/160 caracteres recomendados</p>
            </Field>
          </div>
        </Section>

        {/* ── WHATSAPP ───────────────────────────────────── */}
        <Section icon={MessageCircle} title="WhatsApp Flutuante">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#F5F1EB] px-5 py-4 rounded-2xl">
              <div>
                <p className="font-semibold text-[#5D4E37]">Botão Flutuante Ativo</p>
                <p className="text-xs text-[#999] mt-0.5">Exibe o botão do WhatsApp fixo no site</p>
              </div>
              <button
                onClick={() => set('whatsappFloat', !form.whatsappFloat)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  form.whatsappFloat ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
                  form.whatsappFloat ? 'translate-x-7' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <Field label="Mensagem pré-definida do WhatsApp">
              <Textarea
                value={form.whatsappMsg}
                onChange={e => set('whatsappMsg', e.target.value)}
                rows={2}
                placeholder="Ex: Olá! Vim pelo site e gostaria de saber mais sobre os serviços."
              />
            </Field>
          </div>
        </Section>

        {/* ── ANALYTICS ──────────────────────────────────── */}
        <Section icon={BarChart2} title="Rastreamento & Analytics">
          <div className="space-y-4">
            <Field label="Google Analytics (ID de Medição)">
              <div className="relative">
                <Input
                  type={showGA ? 'text' : 'password'}
                  value={form.googleAnalytics}
                  onChange={e => set('googleAnalytics', e.target.value)}
                  placeholder="Ex: G-XXXXXXXXXX"
                  className="pr-12"
                />
                <button
                  onClick={() => setShowGA(!showGA)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#5D4E37]"
                >
                  {showGA ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </Field>
            <Field label="Meta Pixel (Facebook Pixel ID)">
              <div className="relative">
                <Input
                  type={showPixel ? 'text' : 'password'}
                  value={form.pixelFacebook}
                  onChange={e => set('pixelFacebook', e.target.value)}
                  placeholder="Ex: 123456789012345"
                  className="pr-12"
                />
                <button
                  onClick={() => setShowPixel(!showPixel)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#5D4E37]"
                >
                  {showPixel ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </Field>
          </div>
        </Section>

        {/* ── SALVAR ─────────────────────────────────────── */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {saving ? (
            <><Loader className="w-5 h-5 animate-spin" /> Salvando...</>
          ) : (
            <><Save className="w-5 h-5" /> Salvar Configurações</>
          )}
        </button>
      </div>
    </AdminLayout>
  );
};

export default SettingsAdmin;