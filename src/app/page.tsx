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
  const [points, setPoints] = useState(0);

  const fetchPoints = async () => {
    if (user) {
      try {
        console.log('Fetching points for user:', user.id);
        const { data, error } = await supabase
          .from('user_points')
          .select('points')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Failed to fetch points:', error);
          return;
        }
        console.log('Points fetched:', data?.points);
        setPoints(data?.points ?? 0);
      } catch (error) {
        console.error('Failed to fetch points:', error);
      }
    }
  };

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
    if (!user) {
      console.log('No user found, returning');  // ユーザー未ログイン時のログ
      return;
    }

    try {
      console.log('Capturing pet:', pet);  // キャプチャ開始時のログ

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
      console.log('Pet added to collection successfully');  // コレクション追加成功時のログ
      
      // user_pointsテーブルの確認
      const { data: existingPoints, error: fetchError } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', user.id)
        .single();

      console.log('Existing points check:', { existingPoints, fetchError });  // ポイント確認結果のログ

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!existingPoints) {
        console.log('Creating new points record');  // 新規ポイントレコード作成時のログ
        const { error: insertError } = await supabase
          .from('user_points')
          .insert([
            {
              user_id: user.id,
              points: 10
            }
          ]);
        
        if (insertError) throw insertError;
        console.log('New points record created successfully');  // 作成成功時のログ
      } else {
        console.log('Incrementing existing points');  // ポイント加算時のログ
        const { error: pointsError } = await supabase.rpc('increment_points', {
          target_user_id: user.id,
          points_to_add: 10
        });

        if (pointsError) {
          console.error('Points increment error:', pointsError);  // エラーの詳細をログ出力
          throw pointsError;
        }
        console.log('Points incremented successfully');  // 加算成功時のログ
      }

      // コレクションの状態を更新
      setCollection(prev => {
        const newCollection = !prev.some(p => p.id === pet.id) 
          ? [...prev, pet]
          : prev;
        console.log('Collection updated:', newCollection);  // コレクション更新時のログ
        return newCollection;
      });

      // ペットを画面から削除
      setPets(prev => {
        const newPets = prev.filter(p => p.id !== pet.id);
        console.log('Pets updated:', newPets);  // ペット削除時のログ
        return newPets;
      });

      // ポイントを再取得
      await fetchPoints();
    } catch (error) {
      console.error('Failed to capture pet:', error);  // エラー時の詳細ログ
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
      <UserPoints user={user} points={points} />
      <Garden pets={pets} onCapture={handleCapture} onLeave={handlePetLeave} onFetchPoints={fetchPoints} />
      <ControlPanel onNotebookToggle={toggleNotebook} bgColor="#FFE4B5" textColor="#8B4513" />
      {isNotebookOpen && <CollectionNotebook collection={collection} onClose={toggleNotebook} />}
    </div>
  );
};

export default Page;
