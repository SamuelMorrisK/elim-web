// components/RichText.jsx
// Minimal renderer for Strapi rich-text blocks (paragraphs + headings + lists).
// Avoids the @strapi/blocks-react-renderer dependency.

function renderChildren(children) {
  if (!Array.isArray(children)) return null;
  return children.map((child, i) => {
    let text = child.text ?? "";
    if (!text && child.children) {
      // nested (e.g. link) — flatten its text
      text = child.children.map((c) => c.text ?? "").join("");
    }
    if (child.bold) return <strong key={i}>{text}</strong>;
    if (child.italic) return <em key={i}>{text}</em>;
    return <span key={i}>{text}</span>;
  });
}

export default function RichText({ content }) {
  if (!Array.isArray(content)) return null;

  return (
    <div className="body-prose">
      {content.map((block, i) => {
        switch (block.type) {
          case "heading": {
            const level = block.level || 2;
            const Tag = `h${Math.min(level, 4)}`;
            return (
              <Tag key={i} className="mt-6 mb-2">
                {renderChildren(block.children)}
              </Tag>
            );
          }
          case "list": {
            const Tag = block.format === "ordered" ? "ol" : "ul";
            return (
              <Tag key={i} className="list-disc pl-5 mb-4 space-y-1">
                {(block.children || []).map((item, j) => (
                  <li key={j}>{renderChildren(item.children)}</li>
                ))}
              </Tag>
            );
          }
          case "paragraph":
          default:
            return <p key={i}>{renderChildren(block.children)}</p>;
        }
      })}
    </div>
  );
}
