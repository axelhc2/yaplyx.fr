import React from 'react';

interface SupportIconProps {
  className?: string;
  onDark?: boolean;
}

export default function SupportIcon({ className = '', onDark = false }: SupportIconProps) {
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
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M59 20.6v-4m0 18.7v-6.6m-3.5 20.7 3.5-2v-4M42.6 56.9l5.8-3.4M28.5 61l3.5 2 3.5-2m-19.9-7.4 5.8 3.3M5 43.4v4l3.5 2M5 28.7v6.6m0-18.7v4"
      />
      <path
        fill="currentColor"
        fillOpacity="0.8"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m32 37-4.5-2.6-8.5 4.9 13 7.5 13-7.5-8.5-4.9L32 37Z"
      />
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m32 32.8-7.2-4.2L19 32l13 7.5L45 32l-5.8-3.4-7.2 4.2Z"
      />
      <path
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M26 4.7V20h26.8M25 13H11.5M38 21v7.5m-6 3.7L5 16.6 32 1l27 15.6-27 15.6Z"
      />
    </svg>
  );
}





