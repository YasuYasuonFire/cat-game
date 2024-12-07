import React from 'react';
import { motion } from 'framer-motion';

interface PixelCatIconProps {
  size?: number;
  isWalking: boolean;
  direction: 'left' | 'right';
}

const PixelCatIcon: React.FC<PixelCatIconProps> = ({
  size = 64,
  isWalking,
  direction
}) => {
  // Frame 1 (Standing)
  const frame1Pixels = [
    // Black outline
    [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], [9,1], [10,1], // Top edge
    [2,2], [11,2], // Sides
    [1,3], [12,3],
    [1,4], [12,4],
    [0,5], [13,5],
    [0,6], [13,6],
    [0,7], [13,7],
    [0,8], [13,8],
    [0,9], [13,9],
    [1,10], [12,10],
    [1,11], [12,11],
    [2,12], [3,12], [4,12], [5,12], [6,12], [7,12], [8,12], [9,12], [10,12], [11,12], // Bottom edge
    // Eyes
    [4,6], [9,6],
    // Nose
    [6,8], [7,8],
  ];

  // Frame 2 (Walking)
  const frame2Pixels = [
    ...frame1Pixels,
    [2,13], [11,13], // Add feet pixels for walking frame
  ];

  const pinkPixels = [
    // Inner ears
    [3,2], [10,2],
  ];

  const pixelSize = size / 14; // Adjust grid size to match the reference

  const renderPixel = (x: number, y: number, color: string) => (
    <rect
      key={`${x}-${y}`}
      x={x * pixelSize}
      y={y * pixelSize}
      width={pixelSize}
      height={pixelSize}
      fill={color}
    />
  );

  return (
    <motion.div
      animate={{
        y: isWalking ? [0, -2, 0] : 0,
      }}
      transition={{
        duration: 0.4,
        repeat: isWalking ? Infinity : 0,
        ease: "linear"
      }}
      style={{
        transform: `scaleX(${direction === 'left' ? -1 : 1})`,
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 14 14`}
        style={{ imageRendering: 'pixelated' }}
      >
        {/* White background/body */}
        <rect width="14" height="14" fill="white" />
        
        {/* Render black pixels */}
        {(isWalking ? frame2Pixels : frame1Pixels).map(([x, y]) => 
          renderPixel(x, y, 'black')
        )}
        
        {/* Render pink pixels */}
        {pinkPixels.map(([x, y]) => 
          renderPixel(x, y, '#FFC0CB')
        )}
      </svg>
    </motion.div>
  );
};

export default PixelCatIcon;

