import React from 'react';
import { Pet } from '../types';
import PetIcon from './PetIcon';

interface CollectionNotebookProps {
  collection: Pet[];
  onClose: () => void;
}

const CollectionNotebook: React.FC<CollectionNotebookProps> = ({ collection, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#FFF9E5] bg-opacity-95 z-50 overflow-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Collection Notebook</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {collection.map((pet) => (
            <div key={pet.id} className="bg-[#FFE4B5] p-4 rounded-lg shadow-md flex flex-col items-center">
              <PetIcon type={pet.type} size={64} color={pet.color} />
              <p className="mt-2 text-center font-semibold">
                {pet.type === 'cat' ? 'Cat' : 'Dog'} #{pet.id}
              </p>
              <p className="text-sm text-gray-600">Color: {pet.color}</p>
            </div>
          ))}
        </div>
        {collection.length === 0 && (
          <p className="text-center text-gray-600 mt-8">Your collection is empty. Catch some pets!</p>
        )}
        <button
          onClick={onClose}
          className="mt-8 bg-[#8B4513] text-white px-6 py-2 rounded-full hover:bg-[#A0522D] transition-colors duration-200 block mx-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CollectionNotebook;

