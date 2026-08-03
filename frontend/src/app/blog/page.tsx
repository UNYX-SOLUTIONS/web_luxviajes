/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useBlogData } from "@/hooks/useBlogData";
import { BlogPost } from "@/types";
import { ContactDialog } from "@/components/common/contact_dialog";
import { useRedSocial } from "@/hooks";

// Función para parsear texto con estilo
function parseStyledText(text: string): string {
  if (!text) return "";
  let parsed = text.replace(
    /\*([^*]+)\*/g,
    '<span class="text-primary-600">$1</span>',
  );
  parsed = parsed.replace(/<br\s*\/?>/gi, "<br />");
  parsed = parsed.replace(/\n/g, "<br />");
  return parsed;
}

// Componente para las cards de blog
function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
    >
      <Link href={`/blog/${post.slug}`} className="h-full flex flex-col">
        {/* Image - altura fija */}
        <div className="relative h-52 w-full overflow-hidden shrink-0">
          <Image
            src={
              post.image ||
              "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&h=600&fit=crop"
            }
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
          />
          {post.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-white">
              Destacado
            </span>
          )}
          <div className="absolute bottom-3 left-3">
            <span className="rounded-full bg-neutral-900/70 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content - flex col con altura consistente */}
        <div className="p-5 flex flex-col flex-1 min-h-65 gap-1">
          {/* Metadatos - altura fija, no crece */}
          <div className="flex items-center gap-4 text-xs text-neutral-500 mb-2 shrink-0">
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              {new Date(post.date).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          {/* Título - líneas limitadas, no crece */}
          <h3 className="text-md! lg:text-lg! xl:text-xl! font-bold text-neutral-900 line-clamp-2 group-hover:text-primary-700 transition-colors shrink-0">
            {post.title}
          </h3>

          {/* Excerpt - ocupa espacio flexible con límite */}
          <p className="mt-2 text-sm text-neutral-600 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Footer - siempre al final con mt-auto */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-neutral-100 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={
                  post.authorAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=500088&color=fff&size=24`
                }
                alt={post.author}
                className="h-6 w-6 rounded-full shrink-0"
              />
              <span className="text-xs font-medium text-neutral-700 truncate max-w-30">
                {post.author}
              </span>
            </div>
            <span className="text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors shrink-0 ml-2 flex items-center gap-2">
              Leer más <ArrowRightIcon className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogPage() {
  const { data: blogData, loading, error } = useBlogData();
  const { data: redes } = useRedSocial();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const POSTS_PER_PAGE = 6;

  // Obtener posts del API
  const posts = useMemo(() => {
    if (blogData?.posts && blogData.posts.length > 0) {
      return blogData.posts;
    }
    return [];
  }, [blogData]);

  // Categorías únicas para el filtro
  const categories = useMemo(() => {
    return ["Todos", ...new Set(posts.map((post) => post.category))];
  }, [posts]);

  // Filtrar posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesCategory =
        selectedCategory === "Todos" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  // Paginación — safePage se deriva automáticamente: si los filtros reducen
  // el total de páginas, nunca quedamos en una página inexistente.
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const safePage = totalPages > 0 && currentPage > totalPages ? 1 : currentPage;
  const startIndex = (safePage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE,
  );

  // Función de paginación con puntos suspensivos
  const getPaginationItems = (current: number, total: number) => {
    const delta = 2;
    const range: (number | string)[] = [];

    if (total <= 1) return [1];

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      } else if (
        (i === current - delta - 1 && i > 2) ||
        (i === current + delta + 1 && i < total - 1)
      ) {
        range.push("...");
      }
    }

    const result: (number | string)[] = [];
    for (let i = 0; i < range.length; i++) {
      if (range[i] === "..." && range[i - 1] === "...") continue;
      result.push(range[i]);
    }

    return result;
  };

  // Obtener el post destacado
  const featuredPost = useMemo(() => {
    if (selectedCategory === "Todos" && searchTerm === "") {
      return posts.find((p) => p.featured);
    }
    return null;
  }, [posts, selectedCategory, searchTerm]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-900">
        <div className="absolute inset-0">
          <Image
            src={
              blogData?.heroImagen ||
              "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1800&h=900&fit=crop"
            }
            alt="Blog de viajes"
            fill
            className="h-full w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary-950/85 via-primary-900/60 to-primary-900/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4! py-10! sm:py-15! md:py-20! sm:px-6! lg:px-8! mt-25! flex flex-col justify-center">
          <div className="mx-auto max-w-3xl text-center justify-center text-white">
            <span className="inline-block rounded-full bg-primary-600/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-100 backdrop-blur-sm mb-4">
              Inspiración para tu próximo viaje
            </span>
            <h1
              className="text-3xl! sm:text-4xl! md:text-5xl! lg:text-6xl! xl:text-7xl! font-bold leading-tight!"
              dangerouslySetInnerHTML={{
                __html: parseStyledText(
                  blogData?.heroTitulo || "Blog *Luxviajes*",
                ),
              }}
            />
            <p className="mt-4 text-sm! sm:text-base! md:text-md! lg:text-lg! xl:text-xl! text-neutral-200! max-w-2xl! mx-auto! font-bold">
              {blogData?.heroSubtitulo ||
                "Descubre historias, consejos y destinos que te inspirarán a vivir experiencias inolvidables"}
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Busca artículos, destinos o temas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full bg-white/10 backdrop-blur-lg border border-white/35! px-12 py-3 text-white! placeholder:text-neutral-300 outline-none focus:border-white/65! transition!"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="bg-neutral-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-primary-700 text-white shadow-md"
                      : "bg-white text-neutral-600 hover:bg-neutral-200 ring-1 ring-neutral-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <span className="text-sm text-neutral-500 whitespace-nowrap">
              {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "artículo" : "artículos"}
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">Error al cargar los artículos</p>
            </div>
          )}

          {/* Featured Post */}
          {!loading && featuredPost && (
            <div className="mb-8">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-2 gap-6">
                  <div className="relative md:h-auto min-h-90 w-full overflow-hidden shrink-0">
                    <Image
                      src={
                        featuredPost.image ||
                        "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&h=600&fit=crop"
                      }
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center gap-2">
                    <span className="inline-block rounded-full bg-primary-100 px-3! py-1! text-xs! md:text-md! font-semibold text-primary-700 mb-3! max-w-35 text-center items-center justify-center">
                      Artículo Destacado
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 group-hover:text-primary-700 transition-colors line-clamp-3">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-3 text-neutral-600 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    {/* Boton de leer mas, que sea fondo morado y texto blanco */}
                    <div className="mt-3 bg-primary-700! text-white hover:bg-primary-500! transition-colors duration-300 px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-semibold max-w-30 justify-center">
                      <span className="flex items-center gap-2">
                        Leer más
                        <ArrowRightIcon className="h-4 w-4" />
                      </span>
                    </div>
                    {/* Autor y fecha */}
                    <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(featuredPost.date).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {paginatedPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : !loading && filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-neutral-600">
                No se encontraron artículos que coincidan con tu búsqueda
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Todos");
                }}
                className="mt-4 text-primary-600 font-semibold hover:text-primary-700 transition"
              >
                Ver todos los artículos
              </button>
            </div>
          ) : null}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                disabled={safePage === 1}
                className={`p-2 rounded-full transition ${
                  safePage === 1
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : "bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              {getPaginationItems(safePage, totalPages).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    typeof item === "number" && setCurrentPage(item)
                  }
                  disabled={typeof item !== "number"}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition min-w-10 ${
                    item === safePage
                      ? "bg-primary-700 text-white shadow-md"
                      : typeof item === "number"
                        ? "bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
                        : "text-neutral-500 cursor-default"
                  }`}
                >
                  {item}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, safePage + 1))
                }
                disabled={safePage === totalPages}
                className={`p-2 rounded-full transition ${
                  safePage === totalPages
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : "bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
                }`}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-primary-700 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            ¿Quieres más inspiración?
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-primary-100!">
            Suscríbete a nuestro boletín y recibe las últimas historias de
            viajes, ofertas exclusivas y consejos de nuestros expertos.
          </p>
          <form className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/50"
            />
            <button className="h-12 rounded-full bg-white px-7 text-sm font-semibold text-primary-700 transition hover:bg-primary-50">
              Suscribirme
            </button>
          </form>
        </div>
      </section>

      {/* Contact Dialog */}
      <ContactDialog
        isOpen={showContactDialog}
        onClose={() => setShowContactDialog(false)}
        whatsappNumber={
          redes?.whatsapp?.replace(/[^0-9]/g, "") || "593964220600"
        }
        phoneNumber={redes?.llamada || "+593964220600"}
        videoCallUrl="/contact"
      />
    </>
  );
}
