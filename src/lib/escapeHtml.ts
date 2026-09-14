/**
 * Sanitizes and escapes HTML special characters to prevent XSS vulnerabilities
 * when interpolating dynamic user input into HTML template strings.
 */
export function escapeHtml(str: string | number | null | undefined): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
