import React, { useState, useRef, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import {
  Upload, Copy, Check, Image, Play, Loader,
  X, AlertCircle, CheckCircle, Trash2, ExternalLink,
  PackageOpen
} from 'lucide-react';

interface FileItem {
  file:     File;
  id:       string;
  preview:  string | null;
  status:   'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  url:      string;
  erro:     string;
  tipo:     string;
}

const fmt = (bytes: number) => {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const MidiaAdmin = () => {
  const [queue,    setQueue]    = useState<FileItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [copied,   setCopied]   = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Adiciona arquivos à fila ──────────────────────────────
  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const items: FileItem[] = arr.map(file => {
      const isImg = file.type.startsWith('image/');
      return {
        file,
        id:       `${Date.now()}-${Math.random().toString(36).substr(2,6)}`,
        preview:  isImg ? URL.createObjectURL(file) : null,
        status:   'pending',
        progress: 0,
        url:      '',
        erro:     '',
        tipo:     isImg ? 'image' : 'video',
      };
    });
    setQueue(prev => [...prev, ...items]);
  }, []);

  // ── Sobe UM arquivo ───────────────────────────────────────
  const uploadOne = async (item: FileItem) => {
    setQueue(prev => prev.map(f =>
      f.id === item.id ? { ...f, status: 'uploading', progress: 10 } : f
    ));
    try {
      const fd = new FormData();
      fd.append('file', item.file);
      const { data } = await api.post('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e: any) => {
          const pct = Math.round((e.loaded * 100) / (e.total || 1));
          setQueue(prev => prev.map(f =>
            f.id === item.id ? { ...f, progress: Math.max(10, pct) } : f
          ));
        },
      });
      setQueue(prev => prev.map(f =>
        f.id === item.id ? { ...f, status: 'done', progress: 100, url: data.url, tipo: data.tipo } : f
      ));
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Erro no upload';
      setQueue(prev => prev.map(f =>
        f.id === item.id ? { ...f, status: 'error', progress: 0, erro: msg } : f
      ));
    }
  };

  // ── Sobe TODOS pendentes ──────────────────────────────────
  const uploadAll = async () => {
    const pending = queue.filter(f => f.status === 'pending' || f.status === 'error');
    for (const item of pending) await uploadOne(item);
  };

  // ── Remove da fila ────────────────────────────────────────
  const remove = (id: string) => {
    setQueue(prev => {
      const item = prev.find(f => f.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2500);
  };

  const pending    = queue.filter(f => f.status === 'pending');
  const uploading  = queue.filter(f => f.status === 'uploading');
  const done       = queue.filter(f => f.status === 'done');
  const errors     = queue.filter(f => f.status === 'error');
  const isRunning  = uploading.length > 0;

  // ══════════════════════════════════════════════════════════
  return (
    <AdminLayout title="Mídia / Upload">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Drop Zone ── */}
        <div
          onDragOver={e  => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault(); setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`relative border-4 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer
            transition-all duration-300
            ${dragOver
              ? 'border-[#D4AF7A] bg-[#D4AF7A]/10 scale-[1.01]'
              : 'border-[#D4AF7A]/40 bg-[#F9F5EE] hover:border-[#D4AF7A] hover:bg-[#D4AF7A]/5'
            }`}
        >
          <input
            ref={inputRef} type="file" multiple
            accept="image/*,video/*"
            onChange={e => { addFiles(e.target.files!); e.target.value = ''; }}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-[#5D4E37]">
                Arraste arquivos aqui ou toque para selecionar
              </p>
              <p className="text-[#999] text-xs sm:text-sm mt-1">
                JPG, PNG, WebP, MP4 — até 50MB por arquivo · múltiplos permitidos
              </p>
            </div>
          </div>
        </div>

        {/* ── Dica ── */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs sm:text-sm text-blue-700">
          <strong>💡 Como usar:</strong> Selecione todos os arquivos de uma vez, clique em <strong>Enviar Tudo</strong> e aguarde. Depois copie as URLs geradas.
        </div>

        {/* ── Botões de ação ── */}
        {queue.length > 0 && (
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#666]">
              {pending.length   > 0 && <span className="bg-[#F5F1EB] px-3 py-1 rounded-full font-medium">{pending.length} pendente(s)</span>}
              {uploading.length > 0 && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium animate-pulse">{uploading.length} enviando...</span>}
              {done.length      > 0 && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{done.length} concluído(s)</span>}
              {errors.length    > 0 && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">{errors.length} erro(s)</span>}
            </div>
            <div className="flex gap-2">
              {(pending.length > 0 || errors.length > 0) && (
                <button
                  onClick={uploadAll}
                  disabled={isRunning}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition disabled:opacity-60"
                >
                  {isRunning
                    ? <><Loader className="w-4 h-4 animate-spin" /> Enviando...</>
                    : <><Upload className="w-4 h-4" /> Enviar Tudo ({pending.length + errors.length})</>
                  }
                </button>
              )}
              <button
                onClick={() => setQueue([])}
                disabled={isRunning}
                className="flex items-center gap-2 border-2 border-[#F5F1EB] text-[#999] px-4 py-2.5 rounded-xl font-semibold text-sm hover:border-red-300 hover:text-red-400 transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> Limpar
              </button>
            </div>
          </div>
        )}

        {/* ── Fila de arquivos ── */}
        {queue.length > 0 && (
          <div className="space-y-3">
            {queue.map(item => (
              <div key={item.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm transition-all
                  ${item.status === 'done'      ? 'border-green-200'  : ''}
                  ${item.status === 'error'     ? 'border-red-200'    : ''}
                  ${item.status === 'uploading' ? 'border-[#D4AF7A]/40' : ''}
                  ${item.status === 'pending'   ? 'border-[#F5F1EB]'  : ''}
                `}
              >
                <div className="flex items-center gap-3 p-3 sm:p-4">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#F9F5EE] flex items-center justify-center">
                    {item.preview
                      ? <img src={item.preview} alt="" className="w-full h-full object-cover" />
                      : <Play className="w-6 h-6 text-[#D4AF7A]" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#5D4E37] text-sm truncate">{item.file.name}</p>
                    <p className="text-xs text-[#999] mt-0.5">{fmt(item.file.size)}</p>

                    {/* URL copiável */}
                    {item.status === 'done' && item.url && (
                      <p className="text-xs text-[#D4AF7A] truncate mt-1 hidden sm:block">{item.url}</p>
                    )}

                    {/* Erro */}
                    {item.status === 'error' && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {item.erro}
                      </p>
                    )}

                    {/* Barra de progresso */}
                    {item.status === 'uploading' && (
                      <div className="mt-2 h-1.5 bg-[#F5F1EB] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Status icon + ações */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status === 'uploading' && (
                      <Loader className="w-5 h-5 text-[#D4AF7A] animate-spin" />
                    )}
                    {item.status === 'done' && (
                      <>
                        <a href={item.url} target="_blank" rel="noopener noreferrer"
                          className="p-2 hover:bg-[#F5F1EB] rounded-lg transition hidden sm:flex">
                          <ExternalLink className="w-4 h-4 text-[#999]" />
                        </a>
                        <button
                          onClick={() => copyUrl(item.url)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                            copied === item.url
                              ? 'bg-green-100 text-green-700'
                              : 'bg-[#F5F1EB] text-[#5D4E37] hover:bg-[#D4AF7A]/20'
                          }`}
                        >
                          {copied === item.url
                            ? <><Check className="w-3.5 h-3.5" /> Copiado!</>
                            : <><Copy className="w-3.5 h-3.5" /> Copiar</>
                          }
                        </button>
                      </>
                    )}
                    {item.status === 'error' && (
                      <button
                        onClick={() => uploadOne(item)}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        Tentar novamente
                      </button>
                    )}
                    {item.status === 'pending' && (
                      <button
                        onClick={() => uploadOne(item)}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-[#D4AF7A]/10 text-[#8B7355] hover:bg-[#D4AF7A]/20 transition"
                      >
                        Enviar
                      </button>
                    )}
                    <button
                      onClick={() => remove(item.id)}
                      disabled={item.status === 'uploading'}
                      className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-30"
                    >
                      <X className="w-4 h-4 text-[#ccc] hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Estado vazio ── */}
        {queue.length === 0 && (
          <div className="text-center py-12 text-[#ccc]">
            <PackageOpen className="w-14 h-14 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-[#bbb]">Nenhum arquivo selecionado</p>
            <p className="text-xs text-[#ddd] mt-1">Arraste ou clique na área acima</p>
          </div>
        )}

        {/* ── Resumo URLs (só done) ── */}
        {done.length > 1 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-green-700 text-sm sm:text-base">
                {done.length} arquivo(s) prontos — todas as URLs
              </h3>
            </div>
            <div className="space-y-2">
              {done.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-green-100">
                  <span className="text-xs text-[#999] font-bold w-5 flex-shrink-0">{i + 1}</span>
                  {item.preview && (
                    <img src={item.preview} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <p className="flex-1 text-xs text-[#666] truncate min-w-0">{item.url}</p>
                  <button
                    onClick={() => copyUrl(item.url)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition ${
                      copied === item.url
                        ? 'bg-green-100 text-green-700'
                        : 'bg-[#F5F1EB] text-[#5D4E37] hover:bg-[#D4AF7A]/20'
                    }`}
                  >
                    {copied === item.url ? '✓ Copiado' : 'Copiar'}
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