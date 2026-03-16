import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

function ImageCarousel({ slides = [] }) {
  const normalized = useMemo(() => (slides.length ? slides : []), [slides]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (normalized.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % normalized.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [normalized.length]);

  if (!normalized.length) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      {normalized.map((slide, i) => (
        <div
          key={`${slide.title}-${i}`}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <img src={slide.imageUrl} alt={slide.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:p-10">
            <h1 className="max-w-2xl text-2xl font-bold md:text-4xl">{slide.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-100 md:text-base">{slide.subtitle}</p>
            <div className="mt-4">
              <Link to={slide.ctaLink || '/'} className="inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600">
                {slide.ctaLabel || 'Explore'}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {normalized.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="pointer-events-none relative h-[320px] md:h-[420px]" />
    </section>
  );
}

export default ImageCarousel;
