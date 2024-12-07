import { Pet } from '../types';

const petTypes: ('cat' | 'dog')[] = ['cat', 'dog'];
const petColors = ['#FFB6C1', '#98FB98', '#87CEFA', '#DDA0DD', '#F0E68C', '#FFA07A'];

export const generatePets = (count: number): Pet[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    x: Math.random() * (window.innerWidth - 100),
    y: Math.random() * (window.innerHeight - 100),
    type: petTypes[Math.floor(Math.random() * petTypes.length)],
    color: petColors[Math.floor(Math.random() * petColors.length)],
  }));
};

