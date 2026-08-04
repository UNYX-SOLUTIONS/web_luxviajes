const ALLOWED_TYPES: Record<string, string[]> = {
  jpg: ["ffd8ff"],
  png: ["89504e47"],
  webp: ["52494646"],
  gif: ["47494638"],
};

export function validateFileType(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;
  const hex = buffer.toString("hex", 0, 4).toLowerCase();

  for (const [type, signatures] of Object.entries(ALLOWED_TYPES)) {
    for (const sig of signatures) {
      if (hex.startsWith(sig)) return type;
    }
  }

  return null;
}

export function getFileExtension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}
