import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Clock, User, Calendar, Loader, Heart } from 'lucide-react';

interface Post {
  id: string; titulo: string; slug: string; conteudo: string; excerpt: string;
  imagemUrl: string | null; autor: string; readTime: string;
  tags: string[]; createdAt: string;
}

// ── Sanitizador mínimo: remove scripts e event handlers inline ─────────
// (sem dependência externa — suficiente para conteúdo gerado pelo próprio admin)
function sanitizeHtml(html: string): string {
  return html
    // Remove tags <script> e conteúdo
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove tags <iframe>, <object>, <embed>
    .replace(/<(iframe|object|embed|form|base)[^>]*>[\s\S]*?<\/\1>/gi, '')
    // Remove atributos de event handler (onclick, onload, etc.)
    .replace(/\s+on\w+="[^"]*"/gi, '')
    .replace(/\s+on\w+='[^']*'/gi, '')
    // Remove javascript: em atributos href/src
    .replace(/(href|src)="javascript:[^"]*"/gi, '')
    .replace(/(href|src)='javascript:[^']*'/gi, '');
}

const BlogPostPage = () => {
  const { slug }   = useParams<{ slug: string }>();
  const navigate   = useNavigate();
  const [post,     setPost]     = useState<Post | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/api/blog/${slug}`)
      .then(({ data }) => { setPost(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  // SEO dinâmico por post
  useEffect(() => {
    if (!post) return;
    const prev = {
      title:    document.title,
      desc:     document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      ogTitle:  document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
      ogDesc:   document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
      ogImage:  document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
    };

    // Atualiza título
    document.title = `${post.titulo} | Débora Santiago`;

    // Helper para upsert de meta tags
    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); document.head.appendChild(el); }
      el.setAttribute(attr.includes(':') ? 'property' : 'name', attr);
      el.setAttribute('content', val);
    };

    setMeta('meta[name="description"]',        'name',              post.excerpt);
    setMeta('meta[property="og:title"]',       'og:title',          post.titulo);
    setMeta('meta[property="og:description"]', 'og:description',    post.excerpt);
    setMeta('meta[property="og:type"]',        'og:type',           'article');
    if (post.imagemUrl)
      setMeta('meta[property="og:image"]',     'og:image',          post.imagemUrl);

    return () => {
      document.title = prev.title;
      const setMetaBack = (sel: string, attr: string, val: string) => {
        const el = document.querySelector(sel);
        if (el) el.setAttribute('content', val);
      };
      setMetaBack('meta[name="description"]',        'content', prev.desc);
      setMetaBack('meta[property="og:title"]',       'content', prev.ogTitle);
      setMetaBack('meta[property="og:description"]', 'content', prev.ogDesc);
      setMetaBack('meta[property="og:image"]',       'content', prev.ogImage);
    };
  }, [post]);

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

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">

        {/* Meta */}
        <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-[#F5F1EB] mb-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-[#666]">
            <User className="w-4 h-4 text-[#D4AF7A]" />
            <span className="font-medium">{post.autor}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#666]">
            <Calendar className="w-4 h-4 text-[#D4AF7A]" />
            <span>{new Date(post.createdAt).toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'})}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#666]">
            <Clock className="w-4 h-4 text-[#D4AF7A]" />
            <span>{post.readTime} de leitura</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-2 border-[#F5F1EB]">
          {post.excerpt && (
            <p className="text-lg sm:text-xl text-[#8B7355] font-medium italic border-l-4 border-[#D4AF7A] pl-5 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <style>{`
            .blog-content p                   { margin-bottom: 1rem; color: #444; line-height: 1.8; }
            .blog-content img                 { width:100%; border-radius:12px; margin:16px 0; display:block; box-shadow:0 4px 20px rgba(0,0,0,.08); }
            .blog-content img + p             { text-align:center; font-size:13px; color:#999; margin-top:-8px; margin-bottom:20px; }
            .blog-content h1,.blog-content h2,.blog-content h3 { font-family:'Playfair Display',serif; color:#5D4E37; margin:1.5rem 0 .75rem; font-weight:700; }
            .blog-content ul,.blog-content ol { padding-left:1.5rem; margin-bottom:1rem; color:#444; }
            .blog-content li                  { margin-bottom:.4rem; line-height:1.7; }
            .blog-content strong              { color:#5D4E37; }
            .blog-content a                   { color:#D4AF7A; text-decoration:underline; }
          `}</style>

          {/* FIX: sanitizeHtml antes de renderizar — previne XSS */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.conteudo) }}
          />

          {post.tags?.length > 0 && (
            <div className="mt-8 pt-6 border-t-2 border-[#F5F1EB]">
              <p className="text-sm font-semibold text-[#999] mb-3 uppercase tracking-wider">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-sm bg-[#F5F1EB] text-[#8B7355] px-3 py-1.5 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA — FIX: usa navigate('/') + setTimeout para scroll, sem React Router hash */}
        <div className="mt-10 bg-gradient-to-br from-[#5D4E37] to-[#8B7355] rounded-3xl p-8 text-center text-white">
          <Heart className="w-10 h-10 text-[#D4AF7A] mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Pronto para sua recuperação?</h3>
          <p className="text-[#F5F1EB] mb-6 opacity-90">Agende sua avaliação gratuita com a Débora Santiago.</p>
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 300);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF7A] to-[#8B7355] text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transition"
          >
            Agendar Agora →
          </button>
        </div>

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