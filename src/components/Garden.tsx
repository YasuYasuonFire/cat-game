import React from 'react';
import { Pet } from '../types';
import PetComponent from './PetComponent';

interface GardenProps {
  pets: Pet[];
  onCapture: (pet: Pet) => void;
  onLeave: (id: number) => void;
  onFetchPoints: () => Promise<void>;
}

const Garden: React.FC<GardenProps> = ({ pets, onCapture, onLeave, onFetchPoints }) => {
  console.log('Garden: rendering with pets:', pets);
  
  if (!pets || pets.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl">No pets in the garden yet...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#FFF9E5]">
      {pets.map((pet) => {
        console.log('Garden: rendering pet:', pet.id);
        return (
          <PetComponent 
            key={pet.id} 
            pet={pet} 
            onCapture={async (p) => {
              console.log('Garden: onCapture called for pet:', p.id);
              await onCapture(p);
              await onFetchPoints();
            }} 
            onLeave={onLeave} 
            onFetchPoints={onFetchPoints} 
          />
        );
      })}
    </div>
  );
};

export default Garden;

