"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface UserPointsProps {
  user: User | null;
  points: number;
}

const UserPoints: React.FC<UserPointsProps> = ({ user, points }) => {
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