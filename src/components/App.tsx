import React, { useState, useEffect, useCallback } from 'react';
import Garden from './components/Garden';
import ControlPanel from './components/ControlPanel';
import CollectionNotebook from './components/CollectionNotebook';
import { Pet } from './types';
import { generatePets } from './utils/petGenerator';
import { Howl } from 'howler';

const bgMusic = new Howl({
  src: ['/sounds/gentle_nature.mp3'],
  loop: true,
  volume: 0.5,
});

const App: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [collection, setCollection] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializePets = useCallback(() => {
    try {
      const initialPets = generatePets(5);
      setPets(initialPets);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to generate initial pets:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializePets();
    bgMusic.play();

    const newPetInterval = setInterval(() => {
      setPets(prevPets => {
        try {
          return [...prevPets, ...generatePets(1)];
        } catch (error) {
          console.error('Failed to generate new pet:', error);
          return prevPets;
        }
      });
    }, 15000);

    return () => {
      bgMusic.stop();
      clearInterval(newPetInterval);
    };
  }, [initializePets]);

  const handleCapture = useCallback((pet: Pet) => {
    const captureSound = new Howl({
      src: [pet.type === 'cat' ? '/sounds/meow.mp3' : '/sounds/woof.mp3'],
      volume: 0.7,
    });
    captureSound.play();

    setCollection((prev) => {
      if (!prev.some((p) => p.id === pet.id)) {
        return [...prev, pet];
      }
      return prev;
    });
  }, []);

  const handlePetLeave = useCallback((id: number) => {
    setPets(prevPets => prevPets.filter(pet => pet.id !== id));
  }, []);

  const toggleNotebook = useCallback(() => {
    setIsNotebookOpen(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-green-100 flex justify-center items-center">
        <p className="text-xl font-bold">Loading pets...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FFF9E5] overflow-hidden">
      <Garden pets={pets} onCapture={handleCapture} onLeave={handlePetLeave} />
      <ControlPanel onNotebookToggle={toggleNotebook} bgColor="#FFE4B5" textColor="#8B4513" />
      {isNotebookOpen && <CollectionNotebook collection={collection} onClose={toggleNotebook} />}
    </div>
  );
};

export default App;

