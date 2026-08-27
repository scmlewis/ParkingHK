import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-7 h-7', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-md shadow-sky-600/30 ${className}`}>
      <svg
        viewBox="0 0 512 512"
        width={size}
        height={size}
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="logoBeaconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Squircle base */}
        <rect width="512" height="512" rx="128" fill="url(#logoBgGrad)" />

        {/* Subtle border highlight */}
        <rect
          x="12"
          y="12"
          width="488"
          height="488"
          rx="116"
          fill="none"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="12"
        />

        {/* Radar / GPS beacon ring */}
        <circle
          cx="370"
          cy="140"
          r="70"
          fill="none"
          stroke="rgba(56, 189, 248, 0.25)"
          strokeWidth="14"
          strokeDasharray="16 12"
        />

        {/* Navigation Arrow */}
        <path d="M370 95 L410 140 L370 128 L330 140 Z" fill="#38bdf8" />

        {/* Stylized P Monogram */}
        <path
          d="M 148 108
             L 272 108
             C 342 108 384 148 384 214
             C 384 280 342 320 272 320
             L 220 320
             L 220 404
             C 220 412.8 212.8 420 204 420
             L 164 420
             C 155.2 420 148 412.8 148 404
             Z
             M 220 172
             L 220 256
             L 266 256
             C 298 256 318 240 318 214
             C 318 188 298 172 266 172
             Z"
          fill="#ffffff"
        />

        {/* Live Vacancy Beacon */}
        <circle
          cx="380"
          cy="372"
          r="54"
          fill="#0f172a"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="6"
        />
        <circle cx="380" cy="372" r="42" fill="url(#logoBeaconGrad)" />
        <path
          d="M 364 372 L 376 384 L 398 360"
          fill="none"
          stroke="#ffffff"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
