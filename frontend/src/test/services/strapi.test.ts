import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogPage,
  getHeroSection,
  clearHomeCache,
  getStrapiData,
} from "@/services/strapi";

vi.mock("@/lib/env", async () => {
  const actual = await vi.importActual("@/lib/env");
  return {
    ...actual,
    env: {
      ...actual.env,
      strapiApiUrl: "https://cms.agencialuxviajes.com/admin",
      strapiApiToken: "",
    },
  };
});

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
  clearHomeCache();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getStrapiData", () => {
  it("should fetch data from Strapi and return it", async () => {
    const mockData = { data: [{ id: 1 }], meta: {} };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await getStrapiData("home");
    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://cms.agencialuxviajes.com/api/home",
      expect.objectContaining({
        cache: "no-store",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("should return null on fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const result = await getStrapiData("home");
    expect(result).toBeNull();
  });

  it("should return null on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const result = await getStrapiData("home");
    expect(result).toBeNull();
  });

  it("should return null on 401 authentication error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });
    const result = await getStrapiData("home");
    expect(result).toBeNull();
  });
});

describe("getBlogPosts", () => {
  it("should fetch and transform blog posts", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            {
              id: 1,
              documentId: "post-1",
              titulo: "Test Post",
              slug: "test-post",
              resumen: "A summary",
              contenido: "<p>Content</p>",
              autor: "Author Name",
              fecha: "2026-07-28",
              tiempoLectura: "5 min",
              categoria: "Travel",
              etiquetas: ["travel", "adventure"],
              destacado: true,
              imagen: { url: "/uploads/image.jpg", formats: {} },
              createdAt: "2026-07-28T00:00:00.000Z",
              updatedAt: "2026-07-28T00:00:00.000Z",
              publishedAt: "2026-07-28T00:00:00.000Z",
            },
          ],
          meta: { pagination: { page: 1, pageSize: 50, pageCount: 1, total: 1 } },
        }),
    });

    const result = await getBlogPosts(10);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 1,
      title: "Test Post",
      slug: "test-post",
      excerpt: "A summary",
      content: "<p>Content</p>",
      author: "Author Name",
      date: "2026-07-28",
      readTime: "5 min",
      category: "Travel",
      tags: ["travel", "adventure"],
      featured: true,
    });
  });

  it("should return empty array when no data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: null, meta: {} }),
    });
    const result = await getBlogPosts();
    expect(result).toEqual([]);
  });

  it("should include authorAvatar for each post", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            {
              id: 1,
              documentId: "post-1",
              titulo: "Test",
              slug: "test",
              resumen: "",
              contenido: "",
              autor: "John Doe",
              fecha: "2026-07-28",
              tiempoLectura: "3 min",
              categoria: "General",
              etiquetas: [],
              destacado: false,
              imagen: null,
              createdAt: "2026-07-28T00:00:00.000Z",
              updatedAt: "2026-07-28T00:00:00.000Z",
              publishedAt: "2026-07-28T00:00:00.000Z",
            },
          ],
          meta: {},
        }),
    });

    const result = await getBlogPosts();
    expect(result[0].authorAvatar).toContain("John+Doe");
  });

  it("should use default author when autor is missing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            {
              id: 1,
              documentId: "post-1",
              titulo: "Test",
              slug: "test",
              resumen: "",
              contenido: "",
              fecha: "2026-07-28",
              tiempoLectura: "5 min",
              categoria: "General",
              etiquetas: [],
              destacado: false,
              imagen: null,
              createdAt: "2026-07-28T00:00:00.000Z",
              updatedAt: "2026-07-28T00:00:00.000Z",
              publishedAt: "2026-07-28T00:00:00.000Z",
            },
          ],
          meta: {},
        }),
    });

    const result = await getBlogPosts();
    expect(result[0].author).toBe("Luxviajes");
  });

  it("should default tiempoLectura to 5 min", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            {
              id: 1,
              documentId: "post-1",
              titulo: "Test",
              slug: "test",
              resumen: "",
              contenido: "",
              autor: "Author",
              fecha: "2026-07-28",
              categoria: "General",
              etiquetas: [],
              destacado: false,
              imagen: null,
              createdAt: "2026-07-28T00:00:00.000Z",
              updatedAt: "2026-07-28T00:00:00.000Z",
              publishedAt: "2026-07-28T00:00:00.000Z",
            },
          ],
          meta: {},
        }),
    });

    const result = await getBlogPosts();
    expect(result[0].readTime).toBe("5 min");
  });
});

describe("getBlogPostBySlug", () => {
  it("should fetch a post by slug", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            {
              id: 1,
              documentId: "post-1",
              titulo: "Test Post",
              slug: "test-post",
              resumen: "Summary",
              contenido: "<p>Content</p>",
              autor: "Jane",
              fecha: "2026-07-28",
              tiempoLectura: "4 min",
              categoria: "Culture",
              etiquetas: ["culture"],
              destacado: false,
              imagen: null,
              createdAt: "2026-07-28T00:00:00.000Z",
              updatedAt: "2026-07-28T00:00:00.000Z",
              publishedAt: "2026-07-28T00:00:00.000Z",
            },
          ],
          meta: {},
        }),
    });

    const result = await getBlogPostBySlug("test-post");
    expect(result).not.toBeNull();
    expect(result?.title).toBe("Test Post");
    expect(result?.slug).toBe("test-post");
  });

  it("should return null when post not found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [], meta: {} }),
    });

    const result = await getBlogPostBySlug("nonexistent");
    expect(result).toBeNull();
  });
});

describe("getBlogPage", () => {
  it("should fetch blog page data with hero section", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            id: 1,
            documentId: "blog-page",
            heroTitulo: "Welcome to Blog",
            heroSubtitulo: "Latest stories",
            heroImagen: { url: "/uploads/hero.jpg", formats: {} },
            createdAt: "2026-07-28T00:00:00.000Z",
            updatedAt: "2026-07-28T00:00:00.000Z",
            publishedAt: "2026-07-28T00:00:00.000Z",
          },
          meta: {},
        }),
    });

    const result = await getBlogPage();
    expect(result).not.toBeNull();
    expect(result?.heroTitulo).toBe("Welcome to Blog");
    expect(result?.heroSubtitulo).toBe("Latest stories");
  });

  it("should return null when blog page is not found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: null, meta: {} }),
    });

    const result = await getBlogPage();
    expect(result).toBeNull();
  });
});

describe("getHeroSection", () => {
  it("should return hero section data from blog page", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            id: 1,
            documentId: "blog-page",
            heroTitulo: "Hero Title",
            heroSubtitulo: "Hero Subtitle",
            heroImagen: undefined,
            createdAt: "2026-07-28T00:00:00.000Z",
            updatedAt: "2026-07-28T00:00:00.000Z",
            publishedAt: "2026-07-28T00:00:00.000Z",
          },
          meta: {},
        }),
    });

    const result = await getHeroSection();
    expect(result).toMatchObject({
      heroTitulo: "Hero Title",
      heroSubtitulo: "Hero Subtitle",
    });
    expect(result?.heroImagen).toBeUndefined();
  });

  it("should return null when blog page returns null", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: null, meta: {} }),
    });

    const result = await getHeroSection();
    expect(result).toBeNull();
  });
});