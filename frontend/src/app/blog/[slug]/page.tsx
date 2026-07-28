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
} from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";
import { useBlogData } from "@/hooks/useBlogData";
import { BlogPost } from "@/types";
import { ContactDialog } from "@/components/common/contact_dialog";
import { useRedSocial } from "@/hooks";

export default function BlogPostPage() {
  const params = useParams();
  const { data: blogData, loading, error } = useBlogData();
  const { data: redes } = useRedSocial();
  const [showContactDialog, setShowContactDialog] = useState(false);
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
          p.documentId !== post.documentId && p.categoria === post.categoria,
      )
      .slice(0, 3);
  }, [blogData, post]);

  // Transformar post para el UI
  const postData = useMemo(() => {
    if (!post) return null;
    return {
      id: post.documentId || post.id || "",
      title: post.titulo,
      slug: post.slug,
      excerpt: post.resumen || post.excerpt || "",
      content: post.contenido || post.content || "",
      image: post.imagen || post.image || "",
      author: post.autor || post.author || "Luxviajes",
      authorAvatar:
        post.avatar ||
        `https://ui-avatars.com/api/?name=${(post.autor || post.author || "Luxviajes").replace(" ", "+")}&background=500088&color=fff`,
      date: post.fecha || post.date || new Date().toISOString(),
      readTime: post.tiempoLectura || post.readTime || "5 min",
      category: post.categoria || post.category || "General",
      tags: post.etiquetas || post.tags || [],
      featured: post.destacado || post.featured || false,
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
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

  return (
    <>
      <section className="relative overflow-hidden bg-neutral-900 min-h-[50vh] flex items-end">
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

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-lg text-neutral-700 border-l-4 border-primary-600 pl-4 py-2 mb-8 bg-primary-50/30 rounded-r-lg">
            {postData.excerpt}
          </div>

          <div
            className="prose prose-lg max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-a:text-primary-600"
            dangerouslySetInnerHTML={{
              __html: postData.content || postData.excerpt || "",
            }}
          />

          {postData.tags && postData.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <div className="flex flex-wrap items-center gap-2">
                <TagIcon className="h-4 w-4 text-neutral-500" />
                {postData.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4 pt-6 border-t border-neutral-200">
            <span className="text-sm font-medium text-neutral-600">
              Compartir:
            </span>
            <button className="rounded-full bg-neutral-100 p-2 hover:bg-neutral-200 transition">
              <ShareIcon className="h-4 w-4 text-neutral-600" />
            </button>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="bg-neutral-50 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
              Artículos relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((related: BlogPost) => {
                const relatedData = {
                  slug: related.slug,
                  title: related.titulo,
                  excerpt: related.resumen || related.excerpt || "",
                  image: related.imagen || related.image || "",
                };
                return (
                  <Link
                    key={related.documentId ?? related.id}
                    href={`/blog/${relatedData.slug}`}
                    className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
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
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-neutral-900 group-hover:text-primary-700 transition-colors line-clamp-2">
                        {relatedData.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                        {relatedData.excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
