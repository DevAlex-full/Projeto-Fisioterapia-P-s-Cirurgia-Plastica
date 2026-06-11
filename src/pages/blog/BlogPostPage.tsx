import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Clock, User, Calendar, Loader, Heart } from 'lucide-react';

interface Post {
  id: string; titulo: string; slug: string; conteudo: string; excerpt: string;
  imagemUrl: string | null; autor: string; readTime: string;
  tags: string[]; createdAt: string;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post,     setPost]     = useState<Post | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/api/blog/${slug}`)
      .then(({ data }) => { setPost(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#F9F5EE] flex items-center justify-center">
      <Loader className="w-10 h-10 animate-spin text-[#D4AF7A]" />
    </div>
  );

  if (notFound || !post) return (
    <div className="min-h-screen bg-[#F9F5EE] flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-[#5D4E37] mb-4">Post não encontrado</h1>
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#D4AF7A] font-semibold hover:text-[#8B7355]">
          <ArrowLeft className="w-4 h-4" /> Ver todos os posts
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F5EE]">

      {/* ── Header com imagem de capa ── */}
      {post.imagemUrl ? (
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
          <img src={post.imagemUrl} alt={post.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5D4E37]/80 via-[#5D4E37]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="max-w-4xl mx-auto">
              <Link to="/blog"
                className="inline-flex items-center gap-2 text-[#D4AF7A] hover:text-white transition mb-4 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Voltar ao Blog
              </Link>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                {post.titulo}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#5D4E37] to-[#8B7355] py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog"
              className="inline-flex items-center gap-2 text-[#D4AF7A] hover:text-white transition mb-6 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Blog
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {post.titulo}
            </h1>
          </div>
        </div>
      )}

      {/* ── Conteúdo ── */}
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">

        {/* Meta */}
        <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-[#F5F1EB] mb-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-[#666]">
            <User className="w-4 h-4 text-[#D4AF7A]" />
            <span className="font-medium">{post.autor}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#666]">
            <Calendar className="w-4 h-4 text-[#D4AF7A]" />
            <span>{new Date(post.createdAt).toLocaleDateString('pt-BR', { day:'numeric', month:'long', year:'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#666]">
            <Clock className="w-4 h-4 text-[#D4AF7A]" />
            <span>{post.readTime} de leitura</span>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-2 border-[#F5F1EB]">

          {/* Excerpt destacado */}
          {post.excerpt && (
            <p className="text-lg sm:text-xl text-[#8B7355] font-medium italic border-l-4 border-[#D4AF7A] pl-5 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* ── Conteúdo HTML ── */}
          <style>{`
            .blog-content p { margin-bottom: 1rem; color: #444; line-height: 1.8; }
            .blog-content img {
              width: 100%; border-radius: 12px;
              margin: 16px 0; display: block;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .blog-content img + p {
              text-align: center; font-size: 13px;
              color: #999; margin-top: -8px; margin-bottom: 20px;
            }
            .blog-content h1, .blog-content h2, .blog-content h3 {
              font-family: 'Playfair Display', serif;
              color: #5D4E37; margin: 1.5rem 0 0.75rem;
              font-weight: 700;
            }
            .blog-content ul, .blog-content ol {
              padding-left: 1.5rem; margin-bottom: 1rem; color: #444;
            }
            .blog-content li { margin-bottom: 0.4rem; line-height: 1.7; }
            .blog-content strong { color: #5D4E37; }
            .blog-content a { color: #D4AF7A; text-decoration: underline; }
          `}</style>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.conteudo }}
          />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="mt-8 pt-6 border-t-2 border-[#F5F1EB]">
              <p className="text-sm font-semibold text-[#999] mb-3 uppercase tracking-wider">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag}
                    className="text-sm bg-[#F5F1EB] text-[#8B7355] px-3 py-1.5 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-br from-[#5D4E37] to-[#8B7355] rounded-3xl p-8 text-center text-white">
          <Heart className="w-10 h-10 text-[#D4AF7A] mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Pronto para sua recuperação?</h3>
          <p className="text-[#F5F1EB] mb-6 opacity-90">Agende sua avaliação gratuita com a Débora Santiago.</p>
          <Link to="/#contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transition">
            Agendar Agora →
          </Link>
        </div>

        {/* Voltar */}
        <div className="mt-8 text-center">
          <Link to="/blog"
            className="inline-flex items-center gap-2 text-[#D4AF7A] font-semibold hover:text-[#8B7355] transition">
            <ArrowLeft className="w-4 h-4" /> Ver todos os posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;