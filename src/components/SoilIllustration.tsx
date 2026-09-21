/**
 * On-brand vector illustration used on the landing and auth screens.
 * Healthy soil profile with a young plant — no external image dependency.
 */
export function SoilIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 700"
      className={className}
      role="img"
      aria-label="A young plant growing in layered, healthy soil under an open sky"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EAF3EC" />
          <stop offset="1" stopColor="#DDEBDD" />
        </linearGradient>
        <linearGradient id="soil1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6F5637" />
          <stop offset="1" stopColor="#5A452C" />
        </linearGradient>
      </defs>

      <rect width="600" height="700" fill="url(#sky)" />
      <circle cx="470" cy="120" r="54" fill="#F3E3CF" />

      {/* rolling field */}
      <path d="M0 360 Q150 320 300 352 T600 340 V430 H0 Z" fill="#9FBF8E" />
      <path d="M0 400 Q160 370 320 396 T600 388 V430 H0 Z" fill="#8FB996" />

      {/* soil layers */}
      <rect y="430" width="600" height="70" fill="#9C7A54" />
      <rect y="500" width="600" height="80" fill="#836243" />
      <rect y="580" width="600" height="120" fill="url(#soil1)" />

      {/* organic flecks */}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle
          key={i}
          cx={(i * 97) % 600}
          cy={445 + ((i * 53) % 230)}
          r={2 + (i % 3)}
          fill="#3F3020"
          opacity="0.5"
        />
      ))}

      {/* roots */}
      <path
        d="M300 430 C300 480 280 500 270 540 M300 430 C300 470 320 500 335 545 M300 470 C296 500 300 540 298 600"
        stroke="#C98E5B"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* stem + leaves */}
      <path d="M300 430 C300 360 300 320 300 300" stroke="#2E6A4C" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M300 340 C258 332 232 300 234 262 C276 268 302 300 300 340 Z" fill="#4E8C6C" />
      <path d="M300 320 C342 312 372 280 372 240 C330 246 300 280 300 320 Z" fill="#8FB996" />
      <path d="M300 300 C286 280 286 256 300 236 C314 256 314 280 300 300 Z" fill="#2E6A4C" />
    </svg>
  )
}
