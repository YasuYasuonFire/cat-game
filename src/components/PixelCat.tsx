import React from 'react';
import { motion } from 'framer-motion';

interface PixelCatProps {
  direction: 'left' | 'right';
  isWalking: boolean;
}

const PixelCat: React.FC<PixelCatProps> = ({ direction, isWalking }) => {
  return (
    <motion.div
      className="relative w-16 h-16"
      animate={{
        x: isWalking ? [0, -1, 0, 1, 0] : 0,
      }}
      transition={{
        duration: 1.2,
        repeat: isWalking ? Infinity : 0,
        ease: "linear"
      }}
      style={{
        imageRendering: 'pixelated',
        transform: `scaleX(${direction === 'left' ? -1 : 1})`,
      }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Base white body */}
        <path d="M5,6 h6 v5 h-6 z" fill="white" />
        
        {/* Outline */}
        <path d="M4,6 h1 v5 h-1 z M10,6 h1 v5 h-1 z M5,11 h5 v1 h-5 z M5,5 h5 v1 h-5 z" fill="#4A3526" />
        
        {/* Head outline */}
        <path d="M4,4 h1 v1 h-1 z M10,4 h1 v1 h-1 z" fill="#4A3526" />
        
        {/* Ears */}
        <path d="M3,3 h2 v1 h-2 z M10,3 h2 v1 h-2 z" fill="#4A3526" />
        <path d="M4,2 h1 v1 h-1 z M10,2 h1 v1 h-1 z" fill="#4A3526" />
        
        {/* Inner ears */}
        <path d="M4,3 h1 v1 h-1 z M10,3 h1 v1 h-1 z" fill="#FFC0CB" />
        
        {/* Face white fill */}
        <path d="M5,4 h5 v2 h-5 z" fill="white" />
        
        {/* Eyes */}
        <path d="M5,5 h2 v1 h-2 z M8,5 h2 v1 h-2 z" fill="#4AA5FF" />
        
        {/* Cheeks */}
        <path d="M4,6 h1 v1 h-1 z M10,6 h1 v1 h-1 z" fill="#FFC0CB" />
        
        {/* Legs - animated via CSS */}
        <rect x="5" y="11" width="2" height="1" fill="#4A3526" className="leg front" />
        <rect x="8" y="11" width="2" height="1" fill="#4A3526" className="leg back" />
      </svg>
      <style jsx>{`
        @keyframes walk {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
        .leg {
          animation: ${isWalking ? 'walk 1.2s infinite' : 'none'};
        }
        .leg.back {
          animation-delay: 0.6s;
        }
      `}</style>
    </motion.div>
  );
};

export default PixelCat;

