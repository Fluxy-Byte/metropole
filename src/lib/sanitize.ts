const CONTROL_CHARS_PATTERN = new RegExp(`[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}]`, "g");

/**
 * Strips HTML tags and control characters from free-text user input before
 * persisting it. Complements Zod schema validation at the API boundary.
 */
export function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(CONTROL_CHARS_PATTERN, "")
    .trim();
}

export function sanitizeOptionalText(value: string | null | undefined): string | null {
  if (!value) return null;
  const cleaned = sanitizeText(value);
  return cleaned.length > 0 ? cleaned : null;
}
