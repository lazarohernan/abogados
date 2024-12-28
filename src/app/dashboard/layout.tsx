'use client';

import { ReactNode } from 'react';
import DashboardLayout from './DashboardLayout'; // Importa el layout global si no está ya globalizado

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>; // Deja que el layout global se encargue del diseño
}
