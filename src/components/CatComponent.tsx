import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Cat } from '../types';
import MaterialCatIcon from './MaterialCatIcon';

interface CatComponentProps {
  cat: Cat;
  onCapture: (cat: Cat) => void;
  onLeave: (id: number) => void;
}

const CatComponent: React.FC<CatComponentProps> = ({ cat, onCapture, onLeave }) => {
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [{ x, y }, api] = useSpring(() => ({
    x: cat.x,
    y: cat.y,
    config: { mass: 2, tension: 70, friction: 20 },
  }));

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const newX = Math.random() * (window.innerWidth + 200) - 100;
      const newY = Math.random() * (window.innerHeight + 200) - 100;
      
      setDirection(newX > x.get() ? 'right' : 'left');
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
            onLeave(cat.id);
          }
        }
      });
    }, 10000 + Math.random() * 5000);

    return () => clearInterval(moveInterval);
  }, [api, cat.id, onLeave, x]);

  const handleTap = () => {
    onCapture(cat);
    setIsWalking(false);
    api.start({ 
      y: y.get() - 5,
      config: { tension: 200 } 
    });
    setTimeout(() => {
      api.start({ 
        y: y.get() + 5,
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
      <MaterialCatIcon 
        type={cat.type}
        size={48}
        color={cat.color}
      />
    </animated.div>
  );
};

export default CatComponent;

