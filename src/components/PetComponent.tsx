"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pet } from '../types';
import { Howl } from 'howler';
import PetIcon from './PetIcon';

interface PetComponentProps {
  pet: Pet;
  onCapture: (pet: Pet) => void;
  onLeave: (id: number) => void;
}

const PetComponent: React.FC<PetComponentProps> = ({ pet, onCapture, onLeave }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBeingPet, setIsBeingPet] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [position, setPosition] = useState({
    x: Math.random() * (window.innerWidth * 0.8),
    y: Math.random() * (window.innerHeight * 0.8)
  });

  // サウンドエフェクト
  const playPetSound = () => {
    const sounds = {
      cat: {
        normal: ['/sounds/meow.mp3'],
        happy: ['/sounds/purr.mp3']
      },
      dog: {
        normal: ['/sounds/woof.mp3'],
        happy: ['/sounds/bark.mp3']
      }
    };

    const soundSet = sounds[pet.type][isBeingPet ? 'happy' : 'normal'];
    const sound = new Howl({
      src: [soundSet[Math.floor(Math.random() * soundSet.length)]],
      volume: 0.6
    });
    sound.play();
  };

  // なでなで効果
  const handlePetting = () => {
    if (!isBeingPet) {
      setIsBeingPet(true);
      setShowHearts(true);
      playPetSound();
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
  const handleCapture = () => {
    if (!isBeingPet) {
      playPetSound();
      onCapture(pet);
      setTimeout(() => onLeave(pet.id), 800);
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: position.x, top: position.y }}
      animate={isBeingPet ? "happy" : "idle"}
      variants={moveVariants}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
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

        {/* 吹き出し */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-md"
            >
              <p className="text-sm whitespace-nowrap">
                {pet.type === 'cat' ? 'にゃ〜ん♪' : 'わんわん！'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

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

