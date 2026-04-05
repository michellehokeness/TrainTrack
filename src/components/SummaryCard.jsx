function SummaryCard({ title, value, note, className = '' }) {
  return (
    <article className={`card summary-card ${className}`.trim()}>
      <div className="summary-label">{title}</div>
      <div className="summary-value">{value}</div>
      <div className="summary-note">{note}</div>
    </article>
  );
}

export default SummaryCard;