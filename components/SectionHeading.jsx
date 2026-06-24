// components/SectionHeading.jsx
export default function SectionHeading({ eyebrow, title, center = false }) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className="gold-rule" />
      </div>
      <h2 className="text-3xl sm:text-4xl mt-3">{title}</h2>
    </div>
  );
}
