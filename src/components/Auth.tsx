"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthProps {
  onAuthChange: (user: User | null) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthChange }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 認証状態の監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      onAuthChange(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [onAuthChange]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-green-100 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-8">ペット収集ゲーム</h1>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
      >
        {loading ? 'ログイン中...' : 'Googleでログイン'}
      </button>
    </div>
  );
};

export default Auth; 