'use client';

import DashboardLayout from './DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const profile = {
    full_name: 'Usuario',
    email: 'usuario@ejemplo.com',
    subscription_status: 'active' as const,
    trial_end: '2023-12-31',
  };

  return <DashboardLayout profile={profile}>{children}</DashboardLayout>;
}
