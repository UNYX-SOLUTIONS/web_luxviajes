export interface PendingPurchase {
  id: string | number;
  documentId: string;
  name: string;
  type: string;
  price: number;
  validity?: string;
  processing?: string;
  includes?: string[];
  requisitos?: string;
}

const STORAGE_KEY = "luxviajes_pending_purchase";
const MAX_AGE_MS = 30 * 60 * 1000;

export function savePendingPurchase(service: PendingPurchase): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ service, savedAt: Date.now() }),
    );
  } catch {
    // sessionStorage no disponible
  }
}

export function loadPendingPurchase(): PendingPurchase | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      service?: PendingPurchase;
      savedAt?: number;
    };
    if (
      !parsed.service ||
      typeof parsed.savedAt !== "number" ||
      Date.now() - parsed.savedAt > MAX_AGE_MS
    ) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.service;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearPendingPurchase(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessionStorage no disponible
  }
}
