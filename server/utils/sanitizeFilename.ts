export function sanitizeFilename(input: string, fallback = 'export.txt'): string {
  if (!input) return fallback;
  const name = input.replace(/[/\\?%*:|"<>]/g, '-').trim();
  return name || fallback;
}