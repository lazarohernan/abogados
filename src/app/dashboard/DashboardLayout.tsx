'use client';

import { useState } from 'react';
import UserProfile from '@/types/profile';

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: UserProfile;
  activeSection?: 'chat' | 'settings' | 'history' | 'subscription';
}

export default function DashboardLayout({
  children,
  profile,
  activeSection = 'chat',
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <img
              src={profile.avatar_url || '/default-avatar.png'}
              alt="Avatar"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <div className="font-medium">{profile.full_name}</div>
              <div className="text-sm text-gray-500">{profile.email}</div>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="mt-4">
          {/* Navigation items */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
