import { Cat } from '../types';

const catTypes: ('cat' | 'pets' | 'cruelty_free')[] = ['cat', 'pets', 'cruelty_free'];
const catColors = ['#FF6B6B', '#4ECDC4', '#45046A', '#FF5F7E', '#F9ED69', '#6A0572'];

export const generateCats = (count: number): Cat[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    x: Math.random() * (window.innerWidth - 100),
    y: Math.random() * (window.innerHeight - 100),
    type: catTypes[Math.floor(Math.random() * catTypes.length)],
    color: catColors[Math.floor(Math.random() * catColors.length)],
  }));
};

