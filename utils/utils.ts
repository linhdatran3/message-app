export function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

// Very simple markdown -> HTML converter supporting **bold**, *italic*, `code`, [text](url)
export function renderMarkdownToHtml(input: string) {
  if (!input) return "";
  let out = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // code spans `code`
  out = out.replace(
    /`([^`]+)`/g,
    (m, p1) => `<code class="px-1 rounded bg-slate-100">${p1}</code>`
  );
  // bold **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, (m, p1) => `<strong>${p1}</strong>`);
  // italic *text*
  out = out.replace(/\*([^*]+)\*/g, (m, p1) => `<em>${p1}</em>`);
  // links [text](url)
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    (m, p1, p2) =>
      `<a href="${p2}" target="_blank" rel="noreferrer" class="underline">${p1}</a>`
  );

  // newline -> <br>
  out = out.replace(/\n/g, "<br />");

  return out;
}

export const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
