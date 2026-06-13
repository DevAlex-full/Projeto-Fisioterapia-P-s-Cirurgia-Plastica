import React, { useState, useRef } from 'react';
import api from '../services/api';
import { Upload, X, Image, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface Props {
  value?:    string;
  onChange:  (url: string) => void;
  label?:    string;
  accept?:   string;
  previewH?: string;
}

const ImageUpload = ({
  value    = '',
  onChange,
  label    = 'Imagem',
  accept   = 'image/*,video/*',
  previewH = 'h-48',
}: Props) => {
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isVideo = value && (value.includes('.mp4') || value.includes('.webm') || value.includes('.mov'));

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validação de tamanho (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 50MB.');
      return;
    }

    setError(''); setSuccess(false); setUploading(true); setProgress(0);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e: any) => {
          const pct = Math.round((e.loaded * 100) / (e.total || 1));
          setProgress(pct);
        },
      });
      onChange(data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'Erro ao enviar. Tente novamente.';
      setError(msg);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#5D4E37] mb-2">{label}</label>
      )}

      {/* ── Preview (imagem ou vídeo) ── */}
      {value && !uploading && (
        <div className={`relative ${previewH} rounded-2xl overflow-hidden border-2 border-[#F5F1EB] group mb-2`}>
          {isVideo ? (
            <video src={value} className="w-full h-full object-cover" muted playsInline />
          ) : (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          )}
          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-[#5D4E37] px-3 py-1.5 rounded-xl font-semibold text-xs hover:bg-[#F5F1EB] flex items-center gap-1.5 shadow"
            >
              <Upload className="w-3.5 h-3.5" /> Trocar
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-500 text-white px-3 py-1.5 rounded-xl font-semibold text-xs hover:bg-red-600 flex items-center gap-1.5 shadow"
            >
              <X className="w-3.5 h-3.5" /> Remover
            </button>
          </div>
          {success && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shadow">
              <CheckCircle className="w-3 h-3" /> Enviado!
            </div>
          )}
        </div>
      )}

      {/* ── Área de drop ── */}
      {!value && !uploading && (
        <div
          onDragOver={e  => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`${previewH} border-4 border-dashed rounded-2xl flex flex-col items-center
            justify-center cursor-pointer transition-all select-none
            ${dragging
              ? 'border-[#D4AF7A] bg-[#D4AF7A]/10 scale-[1.01]'
              : 'border-[#D4AF7A]/50 bg-[#F5F1EB] hover:border-[#D4AF7A] hover:bg-[#D4AF7A]/5'
            }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center mb-2 shadow-lg">
            <Image className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm font-bold text-[#5D4E37] text-center px-4">
            {dragging ? 'Solte aqui!' : 'Toque ou arraste para enviar'}
          </p>
          <p className="text-xs text-[#999] mt-1">JPG, PNG, WebP, MP4 — até 50MB</p>
        </div>
      )}

      {/* ── Progresso ── */}
      {uploading && (
        <div className={`${previewH} border-2 border-[#D4AF7A] rounded-2xl bg-[#F5F1EB] flex flex-col items-center justify-center gap-3`}>
          <Loader className="w-8 h-8 text-[#D4AF7A] animate-spin" />
          <p className="text-sm font-bold text-[#5D4E37]">Enviando... {progress}%</p>
          <div className="w-48 bg-white rounded-full h-2.5 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Botão trocar (abaixo do preview) ── */}
      {value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full mt-1.5 py-2.5 border-2 border-dashed border-[#D4AF7A]/40 rounded-xl text-xs text-[#D4AF7A] font-semibold hover:border-[#D4AF7A] hover:bg-[#D4AF7A]/5 transition flex items-center justify-center gap-2"
        >
          <Upload className="w-3.5 h-3.5" /> Trocar arquivo
        </button>
      )}

      {/* ── Erro ── */}
      {error && (
        <div className="mt-2 flex items-start gap-2 text-red-500 text-xs bg-red-50 px-3 py-2.5 rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;