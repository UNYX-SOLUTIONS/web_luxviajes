// Utilidad para combinar clases de Tailwind de forma segura

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
