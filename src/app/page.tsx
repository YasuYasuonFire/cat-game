"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import Garden from '../components/Garden';
import ControlPanel from '../components/ControlPanel';
import CollectionNotebook from '../components/CollectionNotebook';
import UserPoints from '../components/UserPoints';
import Auth from '../components/Auth';
import { Pet } from '../types';
import { generatePets } from '../utils/petGenerator';
import { supabase } from '@/lib/supabase';

const MAX_PETS = 8;
const NEW_PET_INTERVAL = 20000;

const Page: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [collection, setCollection] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializePets = useCallback(() => {
    try {
      const initialPets = generatePets(Math.min(5, MAX_PETS));
      setPets(initialPets);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to generate initial pets:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializePets();

    const newPetInterval = setInterval(() => {
      setPets(prevPets => {
        if (prevPets.length >= MAX_PETS) {
          const indexToRemove = Math.floor(Math.random() * prevPets.length);
          const newPets = [...prevPets];
          newPets.splice(indexToRemove, 1);
          return [...newPets, ...generatePets(1)];
        }
        try {
          return [...prevPets, ...generatePets(1)];
        } catch (error) {
          console.error('Failed to generate new pet:', error);
          return prevPets;
        }
      });
    }, NEW_PET_INTERVAL);

    return () => {
      clearInterval(newPetInterval);
    };
  }, [initializePets]);

  // コレクションの取得
  useEffect(() => {
    const fetchCollection = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('collections')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;
          setCollection(data || []);
        } catch (error) {
          console.error('Failed to fetch collection:', error);
        }
      }
    };

    fetchCollection();
  }, [user]);

  const handleCapture = useCallback(async (pet: Pet) => {
    if (!user) return;

    try {
      // コレクションに追加
      const { error: collectionError } = await supabase
        .from('collections')
        .insert([
          {
            user_id: user.id,
            pet_type: pet.type,
            pet_color: pet.color
          }
        ]);

      if (collectionError) throw collectionError;

      // ポイントを加算
      const { error: pointsError } = await supabase.rpc('increment_points', {
        user_id: user.id,
        points_to_add: 10
      });

      if (pointsError) throw pointsError;

      setCollection(prev => {
        if (!prev.some(p => p.id === pet.id)) {
          return [...prev, pet];
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to capture pet:', error);
    }
  }, [user]);

  const handlePetLeave = useCallback((id: number) => {
    setPets(prevPets => prevPets.filter(pet => pet.id !== id));
  }, []);

  const toggleNotebook = useCallback(() => {
    setIsNotebookOpen(prev => !prev);
  }, []);

  if (!user) {
    return <Auth onAuthChange={setUser} />;
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-green-100 flex justify-center items-center">
        <p className="text-xl font-bold">Loading pets...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FFF9E5] overflow-hidden">
      <UserPoints user={user} />
      <Garden pets={pets} onCapture={handleCapture} onLeave={handlePetLeave} />
      <ControlPanel onNotebookToggle={toggleNotebook} bgColor="#FFE4B5" textColor="#8B4513" />
      {isNotebookOpen && <CollectionNotebook collection={collection} onClose={toggleNotebook} />}
    </div>
  );
};

export default Page;
