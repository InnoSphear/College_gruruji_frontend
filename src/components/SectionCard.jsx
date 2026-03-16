function SectionCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-md shadow-slate-200/70 backdrop-blur">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">{title}</h2>
      {children}
    </section>
  );
}

export default SectionCard;
