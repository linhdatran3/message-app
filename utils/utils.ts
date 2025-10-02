export function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

export const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

export function generateMarkdownToHTML(markdown: string) {
  if (!markdown) return "";

  let html = markdown;

  // Headers (must come before other replacements)
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Code blocks (must come before inline code)
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // Inline code
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Unordered lists
  html = html.replace(/^\* (.+)$/gim, "<li>$1</li>");
  html = html.replace(/^- (.+)$/gim, "<li>$1</li>");
  // html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gim, "<li>$1</li>");

  // Blockquotes
  html = html.replace(/^> (.+)$/gim, "<blockquote>$1</blockquote>");

  // Horizontal rule
  html = html.replace(/^---$/gim, "<hr />");
  html = html.replace(/^\*\*\*$/gim, "<hr />");

  // Line breaks - preserve existing <br> tags and convert double newlines
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/^(.+)$/gim, (match) => {
    if (match.startsWith("<") || match.trim() === "") return match;
    return match;
  });

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith("<")) {
    html = `<p>${html}</p>`;
  }

  return html;
}

export function getHighlightedText(): string {
  const selection = window.getSelection();
  if (selection) {
    return selection.toString();
  }
  return "";
}

// Helper function to get selection range info
export function getSelectionRange() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  return {
    range,
    startContainer: range.startContainer,
    endContainer: range.endContainer,
    startOffset: range.startOffset,
    endOffset: range.endOffset,
  };
}
