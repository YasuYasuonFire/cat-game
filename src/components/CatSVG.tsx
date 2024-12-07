import React from 'react';

interface CatSVGProps {
  color: string;
  variant: 'normal' | 'happy' | 'sleepy';
}

const CatSVG: React.FC<CatSVGProps> = ({ color, variant }) => {
  const getPath = () => {
    switch (variant) {
      case 'happy':
        return (
          <>
            <path d="M50 90C75 90 95 75 95 50C95 25 75 10 50 10C25 10 5 25 5 50C5 75 25 90 50 90Z" fill={color} />
            <path d="M35 40C38 40 40 37 40 33C40 29 38 26 35 26C32 26 30 29 30 33C30 37 32 40 35 40Z" fill="black" />
            <path d="M65 40C68 40 70 37 70 33C70 29 68 26 65 26C62 26 60 29 60 33C60 37 62 40 65 40Z" fill="black" />
            <path d="M50 60C60 60 65 50 65 50" stroke="black" strokeWidth="3" strokeLinecap="round" />
            <path d="M30 20L20 10" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <path d="M70 20L80 10" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <circle cx="30" cy="45" r="5" fill="#FFB6C1" opacity="0.5" />
            <circle cx="70" cy="45" r="5" fill="#FFB6C1" opacity="0.5" />
          </>
        );
      case 'sleepy':
        return (
          <>
            <path d="M50 90C75 90 95 75 95 50C95 25 75 10 50 10C25 10 5 25 5 50C5 75 25 90 50 90Z" fill={color} />
            <path d="M35 40C40 40 45 40 45 40" stroke="black" strokeWidth="3" strokeLinecap="round" />
            <path d="M55 40C60 40 65 40 65 40" stroke="black" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 60C55 65 60 60 60 60" stroke="black" strokeWidth="3" strokeLinecap="round" />
            <path d="M30 20L20 10" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <path d="M70 20L80 10" stroke={color} strokeWidth="4" strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            <path d="M50 90C75 90 95 75 95 50C95 25 75 10 50 10C25 10 5 25 5 50C5 75 25 90 50 90Z" fill={color} />
            <circle cx="35" cy="35" r="5" fill="black" />
            <circle cx="65" cy="35" r="5" fill="black" />
            <path d="M50 55C52 55 54 53 54 53" stroke="black" strokeWidth="3" strokeLinecap="round" />
            <path d="M30 20L20 10" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <path d="M70 20L80 10" stroke={color} strokeWidth="4" strokeLinecap="round" />
          </>
        );
    }
  };

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {getPath()}
    </svg>
  );
};

export default CatSVG;

