import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useBlogData } from "@/hooks/useBlogData";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useBlogData", () => {
  it("should return loading state initially", () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ posts: [] }),
      }),
    );

    const { result } = renderHook(() => useBlogData());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should return posts data on successful fetch", async () => {
    const mockData = {
      posts: [
        {
          id: 1,
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
      ],
      heroTitulo: "Welcome",
      heroSubtitulo: "Latest stories",
      heroImagen: "/uploads/hero.jpg",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const { result, waitFor } = renderHook(() => useBlogData());
    expect(result.current.loading).toBe(true);

    await act(async () => {
      await waitFor(() => expect(result.current.loading).toBe(false));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("should handle 404 error gracefully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const { result, waitFor } = renderHook(() => useBlogData());

    await act(async () => {
      await waitFor(() => expect(result.current.loading).toBe(false));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBeNull();
    expect(result.current.data).toBeNull();
  });

  it("should handle 401 authentication error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result, waitFor } = renderHook(() => useBlogData());

    await act(async () => {
      await waitFor(() => expect(result.current.loading).toBe(false));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error?.message).toContain("Authentication failed");
  });

  it("should handle 429 rate limit error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const { result, waitFor } = renderHook(() => useBlogData());

    await act(async () => {
      await waitFor(() => expect(result.current.loading).toBe(false));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error?.message).toContain("Too many requests");
  });

  it("should handle network error gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result, waitFor } = renderHook(() => useBlogData());

    await act(async () => {
      await waitFor(() => expect(result.current.loading).toBe(false));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBeNull();
  });

  it("should refetch when refetch is called", async () => {
    const mockData = { posts: [], heroTitulo: "Title" };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const { result, waitFor } = renderHook(() => useBlogData());

    await act(async () => {
      await waitFor(() => expect(result.current.loading).toBe(false));
    });

    const initialCallCount = mockFetch.mock.calls.length;

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount);
  });
});