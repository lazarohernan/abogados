import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Error types for better error handling
export type AuthError = {
  code: string;
  message: string;
  status?: number;
  errors?: ValidationErrors;
};

// Form validation types
export type ValidationErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
};

// Profile type
export type Profile = {
  id: string;
  email: string;
  full_name: string;
  subscription_status: 'trial' | 'active' | 'inactive';
  trial_end?: string;
  [key: string]: any; // For additional profile fields
};

// Auth state type
export type AuthState = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
};

export const useAuth = () => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  });

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setState({
            user: session.user,
            profile,
            session,
            loading: false,
            error: null,
          });
        } else {
          setState((prev: AuthState) => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setState((prev: AuthState) => ({
          ...prev,
          loading: false,
          error: {
            code: 'auth/init-error',
            message: 'Error initializing authentication',
          },
        }));
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setState({
            user: session.user,
            profile,
            session,
            loading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Form validation
  const validateForm = (data: Record<string, string>): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = 'Ingresa un correo electrónico válido';
    }

    // Password validation
    if (!data.password || data.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Confirm password validation (for registration)
    if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Full name validation (for registration)
    if (data.fullName !== undefined && data.fullName.length < 3) {
      errors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    return errors;
  };

  const signUp = async ({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    try {
      setState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

      // Validate form data
      const errors = validateForm({ email, password, fullName });
      if (Object.keys(errors).length > 0) {
        throw { code: 'auth/validation-error', message: 'Error de validación', errors };
      }

      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw { code: 'auth/no-user', message: 'No se recibieron datos del usuario' };
      }

      // Create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          subscription_status: 'trial',
          trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (profileError) throw profileError;

      setState({
        user: authData.user,
        profile,
        session: authData.session,
        loading: false,
        error: null,
      });

      return { user: authData.user, profile };
    } catch (err) {
      console.error('SignUp error:', err);
      const error = err as SupabaseAuthError;
      setState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: {
          code: error.code || 'auth/unknown',
          message: error.message || 'Error en el registro',
          errors: (error as any).errors,
        },
      }));
      throw err;
    }
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      setState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

      // Validate form data
      const errors = validateForm({ email, password });
      if (Object.keys(errors).length > 0) {
        throw { code: 'auth/validation-error', message: 'Error de validación', errors };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      setState({
        user: data.user,
        profile,
        session: data.session,
        loading: false,
        error: null,
      });

      return { user: data.user, profile };
    } catch (err) {
      console.error('SignIn error:', err);
      const error = err as SupabaseAuthError;
      setState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: {
          code: error.code || 'auth/unknown',
          message: error.message || 'Error al iniciar sesión',
          errors: (error as any).errors,
        },
      }));
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setState((prev: AuthState) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        error: null,
      });

      router.push('/login');
    } catch (err) {
      console.error('SignOut error:', err);
      const error = err as SupabaseAuthError;
      setState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: {
          code: error.code || 'auth/unknown',
          message: error.message || 'Error al cerrar sesión',
        },
      }));
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState((prev: AuthState) => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setState((prev: AuthState) => ({ ...prev, loading: false }));
    } catch (err) {
      console.error('Reset password error:', err);
      const error = err as SupabaseAuthError;
      setState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: {
          code: error.code || 'auth/unknown',
          message: error.message || 'Error al restablecer la contraseña',
        },
      }));
      throw err;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

      if (!state.user?.id) {
        throw { code: 'auth/no-user', message: 'No hay usuario autenticado' };
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id)
        .select()
        .single();

      if (error) throw error;

      setState((prev: AuthState) => ({
        ...prev,
        profile,
        loading: false,
        error: null,
      }));

      return profile;
    } catch (err) {
      console.error('Update profile error:', err);
      const error = err as SupabaseAuthError;
      setState((prev: AuthState) => ({
        ...prev,
        loading: false,
        error: {
          code: error.code || 'auth/unknown',
          message: error.message || 'Error al actualizar el perfil',
        },
      }));
      throw err;
    }
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    validateForm,
  };
};