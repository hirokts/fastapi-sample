import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { useCallback, useContext } from 'react';
import { SupabaseAuthContext } from '@/app/providers/provider-supabase-auth';

export const useSupabaseAuth = (): {
  loading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  error: Error | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
} => {
  const { session, loading, error } = useContext(SupabaseAuthContext);

  const isAuthenticated = !!session;

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }, []);

  return {
    loading,
    isAuthenticated,
    session,
    error,
    signInWithEmail,
    signOut,
  };
};