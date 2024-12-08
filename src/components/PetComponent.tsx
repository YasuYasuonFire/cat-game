"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pet } from '../types';
import PetIcon from './PetIcon';

interface PetComponentProps {
  pet: Pet;
  onCapture: (pet: Pet) => void;
  onLeave: (id: number) => void;
}

const PetComponent: React.FC<PetComponentProps> = ({ pet, onCapture, onLeave }) => {
  const [isBeingPet, setIsBeingPet] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [position] = useState({
    x: Math.random() * (window.innerWidth * 0.8),
    y: Math.random() * (window.innerHeight * 0.8)
  });

  // なでなで効果
  const handlePetting = () => {
    if (!isBeingPet) {
      setIsBeingPet(true);
      setShowHearts(true);
      setTimeout(() => {
        setIsBeingPet(false);
        setShowHearts(false);
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
    if (!isBeingPet) {
      try {
        // コレクションに追加
        await fetch('/api/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            petType: pet.type,
            petColor: pet.color,
          }),
        });

        onCapture(pet);
        setTimeout(() => onLeave(pet.id), 800);
      } catch (error) {
        console.error('Failed to capture pet:', error);
      }
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: position.x, top: position.y }}
      animate={isBeingPet ? "happy" : "idle"}
      variants={moveVariants}
      whileHover={{ scale: 1.1 }}
      onClick={handleCapture}
      onMouseDown={handlePetting}
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

        {/* ハートエフェクト */}
        <AnimatePresence>
          {showHearts && (
            <motion.div
              className="absolute -top-6 left-1/2"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -30 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <span className="text-pink-500 text-2xl">♥️</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PetComponent;

