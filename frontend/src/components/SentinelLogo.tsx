import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const SentinelLogo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-sky-500 shadow-md shadow-indigo-500/25 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5/6 h-5/6 drop-shadow-sm"
      >
        {/* Outer Shield Path */}
        <path
          d="M18 4L7 8.5V17C7 24 11.8 30.5 18 32C24.2 30.5 29 24 29 17V8.5L18 4Z"
          fill="url(#shield_grad)"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.2"
        />

        {/* Inner Radar / Eye of Sentinel */}
        <circle cx="18" cy="17" r="6" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="18" cy="17" r="3.5" fill="#ffffff" />
        <circle cx="18" cy="17" r="1.5" fill="#4f46e5" />

        {/* Dynamic Scan Ray */}
        <path
          d="M18 10V6M18 24V28M11 17H7M29 17H25"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="shield_grad" x1="7" y1="4" x2="29" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="0.5" stopColor="#4f46e5" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

