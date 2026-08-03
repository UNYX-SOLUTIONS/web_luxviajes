import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "@/app/api/blog/route";
import { getBlogPosts, getBlogPostBySlug, getBlogPage } from "@/services/strapi";

vi.mock("@/services/strapi", () => ({
  getBlogPosts: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  getBlogPage: vi.fn(),
}));

const mockedGetBlogPosts = vi.mocked(getBlogPosts);
const mockedGetBlogPostBySlug = vi.mocked(getBlogPostBySlug);
const mockedGetBlogPage = vi.mocked(getBlogPage);

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function createMockRequest(url: string): Request {
  return new Request(url);
}

describe("GET /api/blog", () => {
  it("should return blog posts when no slug is provided", async () => {
    mockedGetBlogPosts.mockResolvedValue([
      {
        id: 1,
        documentId: "post-1",
        title: "Test Post",
        slug: "test-post",
        excerpt: "Summary",
        content: "<p>Content</p>",
        image: "/uploads/image.jpg",
        author: "Jane Doe",
        date: "2026-07-28",
        readTime: "5 min",
        category: "Travel",
        tags: ["travel"],
        featured: true,
      },
    ]);

    mockedGetBlogPage.mockResolvedValue({
      heroTitulo: "Blog Hero",
      heroSubtitulo: "Latest stories",
      heroImagen: "/uploads/hero.jpg",
    });

    const request = createMockRequest("http://localhost:3000/api/blog");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.posts).toHaveLength(1);
    expect(body.posts[0].title).toBe("Test Post");
    expect(body.heroTitulo).toBe("Blog Hero");
    expect(body.heroSubtitulo).toBe("Latest stories");
  });

  it("should return a single post when slug is provided", async () => {
    mockedGetBlogPostBySlug.mockResolvedValue({
      id: 1,
      documentId: "post-1",
      title: "Single Post",
      slug: "single-post",
      excerpt: "A single post summary",
      content: "<p>Single post content</p>",
      image: "/uploads/single.jpg",
      author: "Author",
      date: "2026-07-28",
      readTime: "3 min",
      category: "News",
      tags: ["news"],
      featured: false,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/blog?slug=single-post",
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.title).toBe("Single Post");
    expect(body.slug).toBe("single-post");
  });

  it("should return 404 when post with slug is not found", async () => {
    mockedGetBlogPostBySlug.mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/blog?slug=nonexistent",
    );
    const response = await GET(request);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Post not found");
  });

  it("should handle authentication errors", async () => {
    mockedGetBlogPosts.mockRejectedValue(
      new Error("Authentication failed: Invalid or expired Strapi token"),
    );

    const request = createMockRequest("http://localhost:3000/api/blog");
    const response = await GET(request);

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Authentication error");
  });

  it("should handle access forbidden errors", async () => {
    mockedGetBlogPosts.mockRejectedValue(
      new Error("Access forbidden: Check Strapi API token permissions"),
    );

    const request = createMockRequest("http://localhost:3000/api/blog");
    const response = await GET(request);

    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toBe("Access forbidden");
  });

  it("should return 500 on unexpected errors", async () => {
    mockedGetBlogPosts.mockRejectedValue(new Error("Unexpected error"));

    const request = createMockRequest("http://localhost:3000/api/blog");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Error al obtener datos del blog");
  });

  it("should return empty posts array when blog page does not exist", async () => {
    mockedGetBlogPosts.mockResolvedValue([]);
    mockedGetBlogPage.mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/blog");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.posts).toEqual([]);
    expect(body.heroTitulo).toBeUndefined();
  });
});