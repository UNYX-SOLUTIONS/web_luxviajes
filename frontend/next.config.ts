import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Optimizaciones de imagen */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: process.env.NODE_ENV === "development",
  },

  /* Compresión y optimizaciones */
  compress: true,
  productionBrowserSourceMaps: false,

  /* React Strict Mode para desarrollo */
  reactStrictMode: true,

  /* Headers para mejor rendimiento */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' *.oppwa.com *.datafast.com.ec",
          },
        ],
      },
      // Caché agresivo para imágenes optimizadas
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Caché para archivos estáticos públicos
      {
        source: "/images(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /* Redirecciones */
  async redirects() {
    return [];
  },

  /* Rewrites */
  async rewrites() {
    return {
      beforeFiles: [
        // Auth API routes — handle locally, do NOT proxy to CMS
        {
          source: "/api/auth/:path*",
          destination: "/api/auth/:path*",
        },
        // User/profile API routes — handle locally
        {
          source: "/api/user/:path*",
          destination: "/api/user/:path*",
        },
        // Payments API — proxy to Express backend
        {
          source: "/api/payments/:path*",
          destination: `${process.env.NEXT_PUBLIC_PAYMENTS_BACKEND_URL || "http://localhost:3001"}/api/payments/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/:path*`,
        },
      ],
    };
  },

  /* Optimizaciones de bundel */
  experimental: {
    optimizePackageImports: ["@components", "@utils", "@lib"],
  },
};

export default nextConfig;
