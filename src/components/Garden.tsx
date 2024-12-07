import React from 'react';
import { Pet } from '../types';
import PetComponent from './PetComponent';

interface GardenProps {
  pets: Pet[];
  onCapture: (pet: Pet) => void;
  onLeave: (id: number) => void;
}

const Garden: React.FC<GardenProps> = ({ pets, onCapture, onLeave }) => {
  if (!pets || pets.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl">No pets in the garden yet...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#FFF9E5]">
      {pets.map((pet) => (
        <PetComponent key={pet.id} pet={pet} onCapture={onCapture} onLeave={onLeave} />
      ))}
    </div>
  );
};

export default Garden;

