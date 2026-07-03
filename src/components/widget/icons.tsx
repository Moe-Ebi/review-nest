// Shared inline SVGs — mirrors the icon set in public/widget.js

const STAR_PATH =
  'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'

export function Star({ off = false }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill={off ? 'rgba(148,163,184,.45)' : 'currentColor'} aria-hidden="true">
      <path d={STAR_PATH} />
    </svg>
  )
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="rn-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} off={i > rating} />
      ))}
    </span>
  )
}

export function FractionalStars({ average }: { average: number }) {
  const pct = Math.max(0, Math.min(100, (average / 5) * 100))
  return (
    <span className="rn-stars-frac" role="img" aria-label={`${average} out of 5 stars`}>
      <span className="rn-stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} off />
        ))}
      </span>
      <span className="rn-stars-fill" style={{ width: `${pct}%` }}>
        <span className="rn-stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} />
          ))}
        </span>
      </span>
    </span>
  )
}

export function GoogleG() {
  return (
    <svg className="rn-g" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export function Chevron({ left = false }: { left?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={left ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="16" height="16" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
