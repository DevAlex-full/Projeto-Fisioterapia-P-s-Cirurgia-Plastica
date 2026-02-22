import React, { useState, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Upload, Copy, Check, Image, Play, Loader, X } from 'lucide-react';

interface UploadedFile { url: string; nome: string; tipo: string; tamanho: number; }

const MidiaAdmin = () => {
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(true); setMsg(null);

    const results: UploadedFile[] = [];
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        results.push(data);
        setMsg({ type: 'success', text: `✅ ${results.length} arquivo(s) enviado(s) com sucesso!` });
      } catch {
        setMsg({ type: 'error', text: `❌ Erro ao enviar: ${file.name}` });
      }
    }

    setUploads(prev => [...results, ...prev]);
    setLoading(false);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <AdminLayout title="Mídia / Upload">
      <div className="max-w-4xl mx-auto">
        {msg && <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}

        {/* Área de Upload */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`border-4 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all mb-8 ${dragOver ? 'border-[#D4AF7A] bg-[#D4AF7A]/10' : 'border-[#D4AF7A]/40 bg-[#F5F1EB] hover:border-[#D4AF7A] hover:bg-[#D4AF7A]/5'}`}
        >
          <input ref={inputRef} type="file" multiple accept="image/*,video/*" onChange={e => handleUpload(e.target.files)} className="hidden" />
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-12 h-12 text-[#D4AF7A] animate-spin" />
              <p className="text-[#5D4E37] font-semibold">Enviando arquivos...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-[#5D4E37]">Arraste arquivos aqui ou clique para selecionar</p>
                <p className="text-[#999] text-sm mt-1">Imagens (JPG, PNG, WebP) e Vídeos (MP4, WebM) — até 50MB por arquivo</p>
              </div>
            </div>
          )}
        </div>

        {/* Instrução */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-700">
          <strong>💡 Como usar:</strong> Após o upload, copie a URL gerada e cole nos campos de imagem/vídeo das seções (Hero, About, Serviços, etc.)
        </div>

        {/* Arquivos enviados */}
        {uploads.length > 0 && (
          <div>
            <h3 className="font-bold text-[#5D4E37] mb-4">Arquivos Enviados nesta Sessão</h3>
            <div className="space-y-3">
              {uploads.map((file, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-md border-2 border-[#F5F1EB] flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F1EB] rounded-xl flex items-center justify-center flex-shrink-0">
                    {file.tipo === 'video' ? <Play className="w-6 h-6 text-[#D4AF7A]" /> : <Image className="w-6 h-6 text-[#D4AF7A]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#5D4E37] truncate text-sm">{file.nome}</p>
                    <p className="text-xs text-[#999]">{formatBytes(file.tamanho)} · {file.tipo}</p>
                    <p className="text-xs text-[#D4AF7A] truncate mt-0.5">{file.url}</p>
                  </div>
                  <button
                    onClick={() => copyUrl(file.url)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition flex-shrink-0 ${copied === file.url ? 'bg-green-100 text-green-700' : 'bg-[#F5F1EB] text-[#5D4E37] hover:bg-[#D4AF7A]/20'}`}
                  >
                    {copied === file.url ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar URL</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MidiaAdmin;