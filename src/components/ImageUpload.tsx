import React, { useState, useRef } from 'react';
import api from '../services/api';
import { Upload, X, Image, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  previewH?: string;
}

const ImageUpload = ({
  value = '',
  onChange,
  label = 'Imagem',
  accept = 'image/*',
  previewH = 'h-48',
}: Props) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setError(''); setSuccess(false); setUploading(true); setProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e: any) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress(pct);
        },
      });
      onChange(data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Erro ao enviar. Tente novamente.');
    } finally {
      setUploading(false); setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-[#5D4E37] mb-2">{label}</label>}

      {/* Preview */}
      {value && !uploading && (
        <div className={`relative ${previewH} rounded-2xl overflow-hidden border-2 border-[#F5F1EB] group mb-3`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="bg-white text-[#5D4E37] px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#F5F1EB] flex items-center gap-2">
              <Upload className="w-4 h-4" /> Trocar
            </button>
            <button type="button" onClick={() => onChange('')}
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-red-600 flex items-center gap-2">
              <X className="w-4 h-4" /> Remover
            </button>
          </div>
          {success && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Enviado!
            </div>
          )}
        </div>
      )}

      {/* Área de drop (sem imagem) */}
      {!value && !uploading && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`${previewH} border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all
            ${dragging ? 'border-[#D4AF7A] bg-[#D4AF7A]/10 scale-[1.02]' : 'border-[#D4AF7A]/50 bg-[#F5F1EB] hover:border-[#D4AF7A] hover:bg-[#D4AF7A]/5'}`}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center mb-3 shadow-lg">
            <Image className="w-7 h-7 text-white" />
          </div>
          <p className="text-sm font-bold text-[#5D4E37]">{dragging ? 'Solte a imagem aqui!' : 'Clique ou arraste a imagem'}</p>
          <p className="text-xs text-[#999] mt-1">JPG, PNG, WebP — máx. 10MB</p>
        </div>
      )}

      {/* Progresso */}
      {uploading && (
        <div className={`${previewH} border-2 border-[#D4AF7A] rounded-2xl bg-[#F5F1EB] flex flex-col items-center justify-center`}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center mb-4 shadow-lg">
            <Upload className="w-8 h-8 text-white animate-bounce" />
          </div>
          <p className="text-sm font-bold text-[#5D4E37] mb-3">Enviando imagem...</p>
          <div className="w-48 bg-white rounded-full h-3 overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-[#D4AF7A] font-bold mt-2">{progress}%</p>
        </div>
      )}

      {/* Botão trocar abaixo do preview */}
      {value && !uploading && (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full mt-2 py-2.5 border-2 border-dashed border-[#D4AF7A]/50 rounded-xl text-sm text-[#D4AF7A] font-semibold hover:border-[#D4AF7A] hover:bg-[#D4AF7A]/5 transition flex items-center justify-center gap-2">
          <Upload className="w-4 h-4" /> Trocar imagem
        </button>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} onChange={handleInputChange} className="hidden" />
    </div>
  );
};

export default ImageUpload;