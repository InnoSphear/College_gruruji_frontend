function SectionCard({ title, children }) {
  return (
    <section className="rounded-xl border border-[var(--ka-border)] bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-[#16324f]">{title}</h2>
      {children}
    </section>
  );
}

export default SectionCard;
