import type { Shot } from '../content/site';

/** Vertical grid lines with a few lavender "full stops" falling along them. */
export function GridLines({ dots = [] as { col: number; d: number; delay: number }[] }) {
  return (
    <div className="gridlines" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i}>
          {dots
            .filter((d) => d.col === i)
            .map((d, k) => (
              <span key={k} className="fdot" style={{ ['--d' as string]: `${d.d}s`, ['--delay' as string]: `${d.delay}s` }} />
            ))}
        </i>
      ))}
    </div>
  );
}

const sizes = {
  desktop: { widths: [960, 1600, 2400], w: 2400, h: 1500 },
  mobile: { widths: [390, 780], w: 780, h: 1688 },
};

/** A real project screenshot inside a neutral browser or phone frame. */
export function ShotFrame({ shot, sizesAttr, eager = false, className = '' }: { shot: Shot; sizesAttr: string; eager?: boolean; className?: string }) {
  const s = sizes[shot.kind];
  const img = (
    <img
      src={`assets/projects/${shot.base}-${s.widths[s.widths.length - 2] ?? s.widths[0]}.webp`}
      srcSet={s.widths.map((w) => `assets/projects/${shot.base}-${w}.webp ${w}w`).join(', ')}
      sizes={sizesAttr}
      width={s.w}
      height={s.h}
      alt={shot.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
  if (shot.kind === 'mobile') return <div className={`phone ${className}`}>{img}</div>;
  return (
    <div className={`browser ${className}`}>
      <div className="browser-bar" aria-hidden="true">
        <b />
        <b />
        <b />
      </div>
      {img}
    </div>
  );
}

/** Split a word into letter spans for the rise-from-centre entrance; text stays readable via aria-label. */
export function Letters({ text, className = '' }: { text: string; className?: string }) {
  const chars = Array.from(text);
  const mid = (chars.length - 1) / 2;
  return (
    <span className={`letters ${className}`} aria-hidden="true">
      {chars.map((c, i) =>
        c === ' ' ? (
          <span key={i}> </span>
        ) : (
          <span key={i} className="letter" style={{ ['--r' as string]: Math.abs(i - mid) }}>
            {c}
          </span>
        ),
      )}
    </span>
  );
}
