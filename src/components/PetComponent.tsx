"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pet } from '../types';
import PetIcon from './PetIcon';

interface PetComponentProps {
  pet: Pet;
  onCapture: (pet: Pet) => void;
  onLeave: (id: number) => void;
  onFetchPoints: () => Promise<void>;
}

const PetComponent: React.FC<PetComponentProps> = ({ pet, onCapture, onLeave, onFetchPoints }) => {
  const [isBeingPet, setIsBeingPet] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [position] = useState({
    x: Math.random() * (window.innerWidth * 0.8),
    y: Math.random() * (window.innerHeight * 0.8)
  });

  // なでなで効果
  const handlePetting = () => {
    if (!isCapturing) {
      setIsBeingPet(true);
      setTimeout(() => {
        setIsBeingPet(false);
      }, 2000);
    }
  };

  // ペットの動きアニメーション
  const moveVariants = {
    idle: {
      x: [0, 10, -10, 0],
      y: [0, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    happy: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity
      }
    },
    capture: {
      scale: [1.2, 0.8, 0],
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "backIn"
      }
    }
  };

  // キャプチャ時の処理
  const handleCapture = async () => {
    if (isCapturing) return;
    
    try {
      console.log('PetComponent: handleCapture called');
      setIsCapturing(true);
      
      if (!onCapture) {
        console.error('PetComponent: onCapture is not defined');
        return;
      }

      // 親コンポーネントのonCaptureを呼び出す
      console.log('PetComponent: calling onCapture with pet:', pet);
      try {
        await onCapture(pet);
        console.log('PetComponent: onCapture completed successfully');
        await onFetchPoints();
      } catch (captureError) {
        console.error('PetComponent: onCapture failed:', captureError);
        setIsCapturing(false);
        return;
      }

      // アニメーション完了後にペットを削除
      console.log('PetComponent: scheduling onLeave');
      setTimeout(() => {
        if (onLeave) {
          console.log('PetComponent: calling onLeave');
          onLeave(pet.id);
        }
      }, 800);

    } catch (error) {
      console.error('PetComponent: Failed to capture pet:', error);
      setIsCapturing(false);
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: position.x, top: position.y }}
      animate={isBeingPet ? "happy" : "idle"}
      variants={moveVariants}
      whileHover={{ scale: 1.1 }}
      onClick={async (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('PetComponent: clicked');
        await handleCapture();
      }}
      onMouseDown={(e: React.MouseEvent) => {
        e.preventDefault();
        handlePetting();
      }}
    >
      <div className="relative">
        {/* ペットのアイコン */}
        <div style={{ 
          filter: isBeingPet ? "brightness(1.2)" : "none",
          transform: `scale(${isBeingPet ? 1.2 : 1})`
        }}>
          <PetIcon 
            type={pet.type}
            size={48}
            color={pet.color}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PetComponent;

