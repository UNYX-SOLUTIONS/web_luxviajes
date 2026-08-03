// Validación de variables de entorno
export const env = {
  // Public variables
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL || "https://cms.agencialuxviajes.com/admin/api",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Luxviajes",
  appDomain: process.env.NEXT_PUBLIC_APP_DOMAIN || "agencialuxviajes.com",
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  enableBetaFeatures: process.env.NEXT_PUBLIC_ENABLE_BETA_FEATURES === "true",

  // Strapi API base URL (distinta de NEXT_PUBLIC_API_URL)
  strapiApiUrl:
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    "https://cms.agencialuxviajes.com/admin/api",
  strapiApiToken: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "",

  // Private variables (server-side only)
  apiSecretKey: process.env.API_SECRET_KEY,
  databaseUrl: process.env.DATABASE_URL,
};

// Validar que las variables requeridas estén presentes en producción
if (process.env.NODE_ENV === "production") {
  const requiredEnvVars = ["NEXT_PUBLIC_API_URL"];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}
