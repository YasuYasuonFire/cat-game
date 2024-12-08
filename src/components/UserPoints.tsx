"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserPointsProps {
  user: User | null;
}

const UserPoints: React.FC<UserPointsProps> = ({ user }) => {
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    const fetchPoints = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_points')
            .select('points')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          setPoints(data?.points ?? 0);
        } catch (error) {
          console.error('Failed to fetch points:', error);
        }
      }
    };

    fetchPoints();

    // リアルタイム更新の購読
    const subscription = supabase
      .channel('user_points_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_points',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          setPoints(payload.new.points);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-md p-3 z-50">
      <div className="text-lg font-bold">
        <span className="text-yellow-500">★</span>
        <span className="ml-2">{points} ポイント</span>
      </div>
    </div>
  );
};

export default UserPoints; 