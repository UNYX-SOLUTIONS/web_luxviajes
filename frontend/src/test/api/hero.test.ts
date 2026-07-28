import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "@/app/api/hero/route";
import { getHeroSection } from "@/services/strapi";

vi.mock("@/services/strapi", () => ({
  getHeroSection: vi.fn(),
}));

const mockedGetHeroSection = vi.mocked(getHeroSection);

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function createMockRequest(url: string): Request {
  return new Request(url);
}

describe("GET /api/hero", () => {
  it("should return hero section data", async () => {
    mockedGetHeroSection.mockResolvedValue({
      heroTitulo: "Welcome",
      heroSubtitulo: "Explore destinations",
      heroImagen: "/uploads/hero.jpg",
    });

    const request = createMockRequest("http://localhost:3000/api/hero");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.heroTitulo).toBe("Welcome");
    expect(body.heroSubtitulo).toBe("Explore destinations");
    expect(body.heroImagen).toBe("/uploads/hero.jpg");
  });

  it("should return 404 when hero section is not found", async () => {
    mockedGetHeroSection.mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/hero");
    const response = await GET(request);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Hero section not found");
  });

  it("should handle authentication errors", async () => {
    mockedGetHeroSection.mockRejectedValue(
      new Error("Authentication failed: Invalid or expired Strapi token"),
    );

    const request = createMockRequest("http://localhost:3000/api/hero");
    const response = await GET(request);

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Authentication error");
  });

  it("should return 500 on unexpected errors", async () => {
    mockedGetHeroSection.mockRejectedValue(
      new Error("Unexpected error"),
    );

    const request = createMockRequest("http://localhost:3000/api/hero");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Internal server error");
  });
});