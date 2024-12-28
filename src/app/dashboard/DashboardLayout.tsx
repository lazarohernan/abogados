'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children, profile }: { children: React.ReactNode; profile: any }) {
  const pathname = usePathname(); // Detecta la ruta actual

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard' },
    { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' },
  ];

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-blue-600">LegalIA</h2>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <a
                className={`flex items-center px-4 py-2 rounded-md transition ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
