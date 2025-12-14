import React from 'react';

interface InvoicesIconProps {
  className?: string;
  onDark?: boolean;
}

export default function InvoicesIcon({ className = '', onDark = false }: InvoicesIconProps) {
  return (
    <svg
      className={`svg-icon ${onDark ? 'svg-icon-on-dark' : ''} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="66"
      height="65"
      fill="none"
      viewBox="0 0 66 65"
    >
      <path
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M41.0288 3.06213C57.5663 7.49333 67.3803 24.4918 62.9491 41.0292C59.5798 53.6038 48.9445 62.2912 36.7708 63.7846"
      />
      <path
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M45.5428 4.64942C44.1028 4.01489 42.596 3.48212 41.0289 3.06221C24.4915 -1.36899 7.49301 8.44507 3.06181 24.9825C-0.335156 37.6602 4.63954 50.6088 14.5972 57.9588"
      />
      <path
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15.0407 50.6448L15.3142 58.8968L6.9606 58.0043"
      />
      <path
        fill="currentColor"
        fillOpacity="0.8"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 55.4001L20.7812 56.9688L52 3.80005L49.2 2.30005L18 20.4V55.4001Z"
      />
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 57.1L52 38.8V3.80005L21 22.1V57.1Z"
      />
      <path
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M47.8 16.7L25.3 29.6M47.8 23.5L25.3 36.5M36.4001 36.5L25.3 42.8"
      />
    </svg>
  );
}





