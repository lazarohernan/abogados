'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserProfile } from '@/types/UserProfile';

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
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard' },
    { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' },
  ];

  return (
    <div className="h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r shadow-md flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            LegalIA
          </Link>
        </div>
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">{profile.full_name[0]}</span>
            </div>
            <div>
              <div className="font-medium">{profile.full_name}</div>
              <div className="text-sm text-gray-500">{profile.email}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
