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

export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML first (to avoid injection issues)
  html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // headings
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // bold + italic
  html = html.replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>");
  html = html.replace(/\*(.*?)\*/gim, "<i>$1</i>");
  html = html.replace(/_(.*?)_/gim, "<i>$1</i>");

  // inline code
  html = html.replace(/`([^`]+)`/gim, "<code>$1</code>");

  // links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

  // unordered list (- item)
  html = html.replace(/^- (.*$)/gim, "<ul><li>$1</li></ul>");
  // ordered list (1. item)
  html = html.replace(/^\d+\. (.*$)/gim, "<ol><li>$1</li></ol>");

  // paragraphs (any line that isn’t wrapped yet)
  html = html.replace(/^\s*(\S.*)$/gm, "<p>$1</p>");

  // line breaks
  html = html.replace(/\n/g, "<br/>");

  // merge multiple <ul> or <ol> into one
  html = html.replace(/<\/ul>\s*<ul>/g, "");
  html = html.replace(/<\/ol>\s*<ol>/g, "");

  return html.trim();
}
