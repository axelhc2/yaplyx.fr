import React from 'react';

interface ServicesIconProps {
  className?: string;
  onDark?: boolean;
}

export default function ServicesIcon({ className = '', onDark = false }: ServicesIconProps) {
  return (
    <svg
      className={`svg-icon ${onDark ? 'svg-icon-on-dark' : ''} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="none"
      viewBox="0 0 64 64"
    >
      <path
        fill="currentColor"
        fillOpacity="0.8"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M59 36.5898V47.4098L32 62.9998L5 47.4098V36.5898L32 44.5898L59 36.5898Z"
      />
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M32 44.3L11.2 32.3L5 35.9L32 51.5L59 35.9L52.8 32.3L32 44.3Z"
      />
      <path
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M32 32.2V43.7M32 32.2L5 16.6M32 32.2L59 16.6M32 43.7L59 28.1V16.6M32 43.7L5 28.1V16.6M5 16.6L32 1L59 16.6M37 34.8L44 30.7"
      />
    </svg>
  );
}










