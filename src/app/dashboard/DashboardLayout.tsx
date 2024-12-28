'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: { full_name: string; email: string };
}) {
  const pathname = usePathname(); // Detecta la ruta actual para resaltar el menú activo

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬', href: '/dashboard' },
    { id: 'history', label: 'Historial', icon: '📚', href: '/dashboard/history' },
    { id: 'settings', label: 'Configuración', icon: '⚙️', href: '/dashboard/settings' },
    { id: 'subscription', label: 'Suscripción', icon: '💳', href: '/dashboard/subscription' },
  ];

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-blue-600">LegalIA</h2>
        </div>

        {/* Información del usuario */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {profile?.full_name?.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-800">{profile?.full_name}</div>
              <div className="text-sm text-gray-500">{profile?.email}</div>
            </div>
          </div>
        </div>

        {/* Menú de navegación */}
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
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
