const REDIRECT_PARAM = "redirect";

export function isSafeInternalPath(
  path: string | null | undefined,
): path is string {
  if (!path || typeof path !== "string") return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.startsWith("/\\")) return false;
  return true;
}

export function getSafeRedirect(
  value: string | null | undefined,
  fallback: string = "/",
): string {
  return isSafeInternalPath(value) ? value : fallback;
}

export function buildAuthHref(
  route: "/auth/login" | "/auth/register",
  currentPath: string,
): string {
  if (!currentPath || currentPath === "/" || !isSafeInternalPath(currentPath)) {
    return route;
  }
  return `${route}?${REDIRECT_PARAM}=${encodeURIComponent(currentPath)}`;
}

export function preserveRedirectParam(
  searchParams: { get: (name: string) => string | null },
  route: string,
): string {
  const redirect = searchParams.get(REDIRECT_PARAM);
  if (!isSafeInternalPath(redirect)) return route;
  return `${route}?${REDIRECT_PARAM}=${encodeURIComponent(redirect)}`;
}
