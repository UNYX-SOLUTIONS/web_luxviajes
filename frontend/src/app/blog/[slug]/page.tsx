/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  ShareIcon,
  HeartIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useState, useMemo } from "react";
import { useBlogData } from "@/hooks/useBlogData";
import { BlogPost, ContentBlock } from "@/types";
import { ContactDialog } from "@/components/common/contact_dialog";
import { useRedSocial } from "@/hooks";

function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-10">
      {blocks.map((block, index) => {
        if (block.__component === "content.image-block") {
          return (
            <figure
              key={`${block.__component}-${block.id}`}
              className="overflow-hidden rounded-xl bg-neutral-50"
            >
              {block.titulo && (
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2 px-1">
                  {block.titulo}
                </h3>
              )}
              {block.subtitulo && (
                <p className="text-sm text-neutral-500 mb-3 px-1">
                  {block.subtitulo}
                </p>
              )}
              <div className="relative w-full overflow-hidden rounded-lg">
                {block.imagen && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={block.imagen}
                    alt={block.texto || block.titulo || "Imagen del artículo"}
                    className="w-full h-auto max-h-125 object-contain bg-neutral-100"
                    loading="lazy"
                  />
                )}
              </div>
              {block.texto && (
                <figcaption className="mt-3 text-sm text-center text-neutral-500 italic px-1">
                  {block.texto}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.__component === "content.text-block") {
          return (
            <div key={`${block.__component}-${block.id}`} className="px-1">
              {block.titulo && (
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-3">
                  {block.titulo}
                </h3>
              )}
              {block.subtitulo && (
                <p className="text-base text-neutral-500 mb-4">
                  {block.subtitulo}
                </p>
              )}
              <div
                className="prose prose-lg max-w-none 
                  prose-headings:text-neutral-900 
                  prose-headings:font-bold 
                  prose-h2:text-2xl 
                  prose-h2:mt-8 
                  prose-h2:mb-4
                  prose-h3:text-xl 
                  prose-h3:mt-6 
                  prose-h3:mb-3
                  prose-p:text-neutral-700 
                  prose-p:leading-relaxed 
                  prose-p:mb-4
                  prose-a:text-primary-600 
                  prose-a:no-underline 
                  prose-a:font-medium
                  prose-a:hover:text-primary-700
                  prose-a:hover:underline
                  prose-strong:text-neutral-900
                  prose-strong:font-semibold
                  prose-ul:text-neutral-700
                  prose-ul:space-y-2
                  prose-li:marker:text-primary-500
                  prose-blockquote:border-l-4
                  prose-blockquote:border-primary-500
                  prose-blockquote:bg-primary-50/30
                  prose-blockquote:px-4
                  prose-blockquote:py-2
                  prose-blockquote:rounded-r-lg
                  prose-blockquote:text-neutral-700
                  prose-blockquote:not-italic
                  prose-img:rounded-xl
                  prose-img:shadow-md"
                dangerouslySetInnerHTML={{
                  __html: block.texto || "",
                }}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const { data: blogData, loading, error } = useBlogData();
  const { data: redes } = useRedSocial();
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const slug = params.slug as string;

  // Encontrar el post por slug
  const post = useMemo(() => {
    if (!blogData?.posts) return null;
    return blogData.posts.find((p: BlogPost) => p.slug === slug);
  }, [blogData, slug]);

  // Posts relacionados (misma categoría)
  const relatedPosts = useMemo(() => {
    if (!blogData?.posts || !post) return [];
    return blogData.posts
      .filter(
        (p: BlogPost) =>
          p.documentId !== post.documentId && p.category === post.category,
      )
      .slice(0, 3);
  }, [blogData, post]);

  // Transformar post para el UI
  const postData = useMemo(() => {
    if (!post) return null;
    return {
      id: post.documentId || String(post.id) || "",
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || [],
      image: post.image || "",
      author: post.author || "Luxviajes",
      authorAvatar:
        post.authorAvatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author || "Luxviajes")}&background=500088&color=fff&size=64`,
      date: post.date || new Date().toISOString(),
      readTime: post.readTime || "5 min",
      category: post.category || "General",
      tags: post.tags || [],
      featured: post.featured || false,
    };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-neutral-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-20! mt-20!">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Artículo no encontrado
          </h1>
          <p className="mt-2 text-neutral-600">
            El artículo que buscas no existe o ha sido eliminado.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-block rounded-full bg-primary-700 px-6 py-3 text-white font-semibold hover:bg-primary-800 transition"
          >
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: postData.title,
        text: postData.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado al portapapeles!");
    }
  };

  return (
    <>
      {/* Hero Section - SIN CAMBIOS EN PADDING TOP */}
      <section className="relative overflow-hidden bg-neutral-900 min-h-[50vh] flex items-end pt-10! sm:pt-15! md:pt-20! lg:pt-25!">
        <div className="absolute inset-0">
          <Image
            src={
              postData.image ||
              "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1800&h=900&fit=crop"
            }
            alt={postData.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-900/50 to-neutral-900/30" />
        </div>

        <div className="relative w-full mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 md:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-sm">Volver al blog</span>
          </Link>

          <div className="text-white">
            <span className="inline-block rounded-full bg-primary-600/30 px-3 py-1 text-xs font-semibold text-primary-100 backdrop-blur-sm mb-4">
              {postData.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {postData.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                {postData.author}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {new Date(postData.date).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {postData.readTime} de lectura
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Excerpt con mejor estilo */}
          <div className="relative mb-10 bg-linear-to-r from-primary-50/50 to-transparent rounded-xl p-6 border-l-4 border-primary-500">
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
              {postData.excerpt}
            </p>
          </div>

          {/* Contenido con imágenes optimizadas */}
          <ContentBlocks blocks={postData.content} />

          {/* Tags */}
          {postData.tags && postData.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <div className="flex flex-wrap items-center gap-2">
                <TagIcon className="h-5 w-5 text-neutral-400" />
                <span className="text-sm font-medium text-neutral-600 mr-2">
                  Etiquetas:
                </span>
                {postData.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-medium text-neutral-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Interacciones y Compartir */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                {isLiked ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span>{isLiked ? "Te gusta" : "Me gusta"}</span>
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                <BookmarkIcon
                  className={`h-5 w-5 ${isBookmarked ? "fill-primary-600 text-primary-600" : ""}`}
                />
                <span>{isBookmarked ? "Guardado" : "Guardar"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">
                Compartir:
              </span>
              <button
                onClick={handleShare}
                className="rounded-full bg-primary-700 p-2.5 text-white hover:bg-primary-800 transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Autor Bio */}
          <div className="mt-10 p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
            <div className="flex items-start gap-4">
              <img
                src={postData.authorAvatar}
                alt={postData.author}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-primary-100"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-neutral-900">
                  {postData.author}
                </h4>
                <p className="text-sm text-neutral-600 mt-1">
                  Escrito por nuestro equipo de expertos en viajes. Descubre
                  destinos increíbles y consejos para tus próximas aventuras.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Relacionados - MEJORADO */}
      {relatedPosts.length > 0 && (
        <section className="bg-neutral-50 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                Artículos relacionados
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related: BlogPost) => {
                const relatedData = {
                  slug: related.slug,
                  title: related.title,
                  excerpt: related.excerpt || "",
                  image: related.image || "",
                  category: related.category || "General",
                  date: related.date || new Date().toISOString(),
                };
                return (
                  <Link
                    key={related.documentId ?? related.id}
                    href={`/blog/${relatedData.slug}`}
                    className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                  >
                    <div className="relative h-52 w-full overflow-hidden shrink-0">
                      {relatedData.image ? (
                        <Image
                          src={relatedData.image}
                          alt={relatedData.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-400">Sin imagen</span>
                        </div>
                      )}
                      <span className="absolute bottom-3 left-3 rounded-full bg-neutral-900/70 px-3 py-1 text-xs text-white backdrop-blur-sm">
                        {relatedData.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {new Date(relatedData.date).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </div>
                      <h3 className="font-bold text-neutral-900 group-hover:text-primary-700 transition-colors line-clamp-2">
                        {relatedData.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-2 flex-1">
                        {relatedData.excerpt}
                      </p>
                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
                          Leer más →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary-700 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            ¿Listo para vivir tu propia aventura?
          </h3>
          <p className="mt-3 text-primary-100 max-w-2xl mx-auto">
            Nuestros expertos están listos para diseñar el viaje de tus sueños.
            Planificación personalizada y sin compromiso.
          </p>
          <button
            onClick={() => setShowContactDialog(true)}
            className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 hover:shadow-xl"
          >
            Contactar a un asesor
          </button>
        </div>
      </section>

      <ContactDialog
        isOpen={showContactDialog}
        onClose={() => setShowContactDialog(false)}
      />
    </>
  );
}
