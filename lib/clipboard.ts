/**
 * The one clipboard path on this site.
 *
 * Lifted verbatim out of `components/prompt.tsx`, where it was proven against the five meta
 * prompts. It lives in its own module because the `execCommand` branch is the part that matters and the part nobody re-derives correctly:
 * `navigator.clipboard` is unavailable on a non-secure origin and can be refused by permission
 * policy, and a Copy button that silently does nothing is worse than no button.
 */
export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Clipboard permission can be refused; fall back to a selection the browser will copy.
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
}
