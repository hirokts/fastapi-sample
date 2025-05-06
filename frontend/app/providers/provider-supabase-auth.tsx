'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import type React from 'react';

type SupabaseAuthContextType = {
  session: Session | null;
  loading: boolean;
  error: Error | null;
};

export const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      if (error) {
        setError(error);
        console.error('Error fetching session:', error.message);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event !== 'INITIAL_SESSION') {
        setLoading(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseAuthContext.Provider value={{ session, loading, error }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};
