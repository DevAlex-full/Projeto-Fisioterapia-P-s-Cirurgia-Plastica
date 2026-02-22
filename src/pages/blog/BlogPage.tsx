import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, ArrowRight, Clock, User, Search, X, Heart, Loader, Tag } from 'lucide-react';

interface Post { id: string; titulo: string; slug: string; excerpt: string; imagemUrl: string | null; autor: string; readTime: string; tags: string[]; destaque: boolean; createdAt: string; }

const POSTS_POR_PAGINA = 6;

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [tagAtiva, setTagAtiva] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    api.get('/api/blog').then(({ data }) => { setPosts(data); setLoading(false); });
  }, []);

  const postDestaque = posts.find(p => p.destaque);

  const todasTags = useMemo(() => {
    const tags = posts.flatMap(p => p.tags || []);
    return [...new Set(tags)].sort();
  }, [posts]);

  const temFiltro = busca || tagAtiva;

  const postsFiltrados = useMemo(() => {
    return posts
      .filter(p => temFiltro ? true : !p.destaque)
      .filter(p => {
        const matchBusca = !busca || p.titulo.toLowerCase().includes(busca.toLowerCase()) || p.excerpt.toLowerCase().includes(busca.toLowerCase());
        const matchTag = !tagAtiva || p.tags?.includes(tagAtiva);
        return matchBusca && matchTag;
      });
  }, [posts, busca, tagAtiva, temFiltro]);

  const totalPaginas = Math.ceil(postsFiltrados.length / POSTS_POR_PAGINA);
  const postsNaPagina = postsFiltrados.slice((pagina - 1) * POSTS_POR_PAGINA, pagina * POSTS_POR_PAGINA);

  const limparFiltros = () => { setBusca(''); setTagAtiva(''); setPagina(1); };

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#5D4E37] to-[#8B7355] py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[#D4AF7A] hover:text-white transition mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Site
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#D4AF7A] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#D4AF7A] font-semibold text-sm uppercase tracking-wider">Débora Santiago</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">Blog & Dicas</h1>
          <p className="text-[#F5F1EB] text-lg sm:text-xl max-w-2xl opacity-90">Conteúdo exclusivo sobre fisioterapia pós-operatória, dicas de recuperação e saúde.</p>
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF7A]" />
              <input type="text" value={busca} onChange={e => { setBusca(e.target.value); setPagina(1); }} placeholder="Buscar artigos..."
                className="w-full pl-12 pr-12 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-[#D4AF7A] focus:bg-white/20 transition" />
              {busca && <button onClick={() => { setBusca(''); setPagina(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"><X className="w-5 h-5" /></button>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
        {loading ? (
          <div className="flex justify-center py-20"><Loader className="w-10 h-10 animate-spin text-[#D4AF7A]" /></div>
        ) : (
          <>
            {/* POST EM DESTAQUE */}
            {postDestaque && !temFiltro && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4"><span className="text-lg">⭐</span><h2 className="text-lg font-bold text-[#5D4E37]">Post em Destaque</h2></div>
                <Link to={`/blog/${postDestaque.slug}`}
                  className="group grid sm:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden h-64 sm:h-auto">
                    {postDestaque.imagemUrl
                      ? <img src={postDestaque.imagemUrl} alt={postDestaque.titulo} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      : <div className="w-full h-full bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center"><Heart className="w-16 h-16 text-white opacity-50" /></div>}
                    <div className="absolute top-4 left-4 bg-[#D4AF7A] text-white text-xs font-bold px-3 py-1.5 rounded-full">⭐ Destaque</div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <p className="text-xs text-[#D4AF7A] font-semibold mb-3">{new Date(postDestaque.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#5D4E37] mb-4 leading-tight group-hover:text-[#D4AF7A] transition">{postDestaque.titulo}</h2>
                    <p className="text-[#666] leading-relaxed mb-6 line-clamp-3">{postDestaque.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-[#999]">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {postDestaque.autor}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {postDestaque.readTime}</span>
                      </div>
                      <span className="text-[#D4AF7A] font-bold text-sm flex items-center gap-1 group-hover:gap-3 transition-all">Ler artigo <ArrowRight className="w-4 h-4" /></span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* TAGS */}
            {todasTags.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3"><Tag className="w-4 h-4 text-[#D4AF7A]" /><span className="text-sm font-semibold text-[#5D4E37]">Filtrar por tema:</span></div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setTagAtiva(''); setPagina(1); }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${!tagAtiva ? 'bg-[#D4AF7A] text-white shadow-md' : 'bg-white text-[#5D4E37] hover:bg-[#D4AF7A]/10 border-2 border-[#F5F1EB]'}`}>
                    Todos
                  </button>
                  {todasTags.map(tag => (
                    <button key={tag} onClick={() => { setTagAtiva(tag); setPagina(1); }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${tagAtiva === tag ? 'bg-[#D4AF7A] text-white shadow-md' : 'bg-white text-[#5D4E37] hover:bg-[#D4AF7A]/10 border-2 border-[#F5F1EB]'}`}>
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RESULTADO */}
            {temFiltro && (
              <div className="flex items-center justify-between mb-6 bg-white rounded-2xl p-4 shadow-sm border-2 border-[#F5F1EB]">
                <p className="text-sm text-[#5D4E37]">
                  <span className="font-bold">{postsFiltrados.length}</span> resultado(s)
                  {busca && <> para "<span className="text-[#D4AF7A] font-bold">{busca}</span>"</>}
                  {tagAtiva && <> na tag <span className="text-[#D4AF7A] font-bold">#{tagAtiva}</span></>}
                </p>
                <button onClick={limparFiltros} className="text-sm text-[#999] hover:text-[#D4AF7A] font-semibold flex items-center gap-1"><X className="w-4 h-4" /> Limpar</button>
              </div>
            )}

            {/* GRID */}
            {postsNaPagina.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-[#999] text-lg font-medium">Nenhum post encontrado.</p>
                <button onClick={limparFiltros} className="mt-4 text-[#D4AF7A] font-semibold hover:text-[#8B7355]">Limpar filtros</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {postsNaPagina.map(post => (
                  <Link key={post.id} to={`/blog/${post.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden h-52">
                      {post.imagemUrl
                        ? <img src={post.imagemUrl} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        : <div className="w-full h-full bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] flex items-center justify-center"><Heart className="w-12 h-12 text-white opacity-50" /></div>}
                      <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-[#5D4E37] shadow-md flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-[#D4AF7A] font-semibold mb-2">{new Date(post.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <h2 className="text-lg font-bold text-[#5D4E37] mb-3 group-hover:text-[#D4AF7A] transition leading-tight line-clamp-2">{post.titulo}</h2>
                      <p className="text-sm text-[#666] mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-[#999]"><User className="w-3 h-3" /> {post.autor}</div>
                        <span className="text-[#D4AF7A] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Ler mais <ArrowRight className="w-4 h-4" /></span>
                      </div>
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs bg-[#F5F1EB] text-[#8B7355] px-2 py-1 rounded-full font-medium">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* PAGINAÇÃO */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
                  className="p-3 bg-white rounded-xl shadow-md border-2 border-[#F5F1EB] hover:border-[#D4AF7A] disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <ArrowLeft className="w-5 h-5 text-[#5D4E37]" />
                </button>
                {[...Array(totalPaginas)].map((_, i) => (
                  <button key={i} onClick={() => setPagina(i + 1)}
                    className={`w-11 h-11 rounded-xl font-bold text-sm transition shadow-md ${pagina === i + 1 ? 'bg-gradient-to-br from-[#D4AF7A] to-[#8B7355] text-white' : 'bg-white text-[#5D4E37] border-2 border-[#F5F1EB] hover:border-[#D4AF7A]'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
                  className="p-3 bg-white rounded-xl shadow-md border-2 border-[#F5F1EB] hover:border-[#D4AF7A] disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <ArrowRight className="w-5 h-5 text-[#5D4E37]" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;