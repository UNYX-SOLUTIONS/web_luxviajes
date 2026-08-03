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
              className="overflow-hidden rounded-xl bg-neutral-50!"
            >
              {block.titulo && (
                <h3 className="text-xl! md:text-2xl! font-bold text-neutral-900! mb-2 px-1">
                  {block.titulo}
                </h3>
              )}
              {block.subtitulo && (
                <p className="text-sm! text-neutral-500! mb-3! px-1!">
                  {block.subtitulo}
                </p>
              )}
              <div className="relative w-full overflow-hidden rounded-lg">
                {block.imagen && (
                   
                  <img
                    src={block.imagen}
                    alt={block.texto || block.titulo || "Imagen del artículo"}
                    className="w-full h-auto max-h-125 object-contain bg-white"
                    loading="lazy"
                  />
                )}
              </div>
              {block.texto && (
                <figcaption className="pt-3 text-sm text-center text-neutral-500 italic px-1 bg-white">
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
            {/* <div className="flex items-center gap-2">
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
            </div> */}
            {/* Redes sociales */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-700">
                Síguenos:
              </span>
              {redes?.instagram && (
                <a
                  href={redes.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-neutral-100 p-2 text-neutral-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                  </svg>
                </a>
              )}
              {redes?.facebook && (
                <a
                  href={redes.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-neutral-100 p-2 text-neutral-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {redes?.tiktok && (
                <a
                  href={redes.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-neutral-100 p-2 text-neutral-600 hover:bg-neutral-900 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 23 23"
                    fill="currentColor"
                  >
                    <path d="M11.3145 0C17.5631 9.07103e-05 22.6289 5.0658 22.6289 11.3145C22.6288 17.563 17.563 22.6288 11.3145 22.6289C5.0658 22.6289 8.86512e-05 17.5631 0 11.3145C0 5.06575 5.06575 0 11.3145 0ZM11.4023 2.51465L11.376 13.9209C11.376 15.3207 10.1381 16.4229 8.73828 16.4229C7.33863 16.4227 6.20508 15.2893 6.20508 13.8896C6.20523 12.4901 7.33872 11.3566 8.73828 11.3564C8.84274 11.3564 8.94764 11.3772 9.04688 11.3877V8.94336C8.94241 8.93814 8.84274 8.92773 8.73828 8.92773C5.9964 8.92787 3.77164 11.1478 3.77148 13.8896C3.77148 16.6317 5.99131 18.8574 8.7334 18.8574C11.4755 18.8574 13.7002 16.6317 13.7002 13.8896V7.17285C14.5045 8.40549 15.8787 9.14746 17.3516 9.14746C17.4195 9.14745 17.4861 9.14455 17.5527 9.14062L17.7588 9.12695V6.40527C15.6541 6.25382 13.9618 4.61408 13.7422 2.51465H11.4023Z" />
                  </svg>
                </a>
              )}
              {redes?.youtube && (
                <a
                  href={redes.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-neutral-100 p-2 text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
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
                  Escrito por nuestros clientes y expertos en viajes,
                  compartiendo experiencias y consejos para inspirarte a
                  explorar el mundo con Luxviajes.
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
          <h3 className="text-2xl md:text-3xl font-bold text-white!">
            ¿Listo para vivir tu propia aventura?
          </h3>
          <p className="mt-3 text-primary-100! max-w-2xl mx-auto">
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
