'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Check subscription status
        if (data) {
          const trialEnd = data.trial_end ? new Date(data.trial_end) : null;
          const isTrialExpired = trialEnd ? trialEnd < new Date() : true;

          if (data.subscription_status === 'inactive' && isTrialExpired) {
            router.push('/subscription');
            return;
          }

          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state if no profile
  if (!profile) {
    return null; // Router will handle redirect
  }

  return <DashboardLayout profile={profile}>{children}</DashboardLayout>;
}