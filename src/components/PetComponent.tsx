import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Pet } from '../types';
import PetIcon from './PetIcon';

interface PetComponentProps {
  pet: Pet;
  onCapture: (pet: Pet) => void;
  onLeave: (id: number) => void;
}

const PetComponent: React.FC<PetComponentProps> = ({ pet, onCapture, onLeave }) => {
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [{ x, y }, api] = useSpring(() => ({
    x: pet.x ?? Math.random() * window.innerWidth,
    y: pet.y ?? Math.random() * window.innerHeight,
    config: { mass: 2, tension: 70, friction: 20 },
  }));

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const currentX = x.get();
      const currentY = y.get();
      const newX = Math.random() * (window.innerWidth + 200) - 100;
      const newY = Math.random() * (window.innerHeight + 200) - 100;
      
      setDirection(newX > currentX ? 'right' : 'left');
      setIsWalking(true);
      
      api.start({
        x: newX,
        y: newY,
        config: { duration: 8000 }, // 8 seconds movement duration
        onRest: () => {
          setIsWalking(false);
          if (
            newX < -100 || 
            newX > window.innerWidth + 100 || 
            newY < -100 || 
            newY > window.innerHeight + 100
          ) {
            onLeave(pet.id);
          }
        }
      });
    }, 10000 + Math.random() * 5000);

    return () => clearInterval(moveInterval);
  }, [api, pet.id, onLeave, x, y]);

  const handleTap = () => {
    onCapture(pet);
    setIsWalking(false);
    const currentY = y.get();
    api.start({ 
      y: currentY - 5,
      config: { tension: 200 } 
    });
    setTimeout(() => {
      api.start({ 
        y: currentY + 5,
        config: { tension: 200 } 
      });
    }, 200);
  };

  return (
    <animated.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scaleX(${direction === 'left' ? -1 : 1})`,
      }}
      onClick={handleTap}
      className="cursor-pointer transition-transform hover:scale-110"
    >
      <PetIcon 
        type={pet.type}
        size={48}
        color={pet.color}
      />
    </animated.div>
  );
};

export default PetComponent;

