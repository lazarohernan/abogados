import DashboardLayout from './DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout profile={{ full_name: 'Usuario', email: 'usuario@ejemplo.com' }}>{children}</DashboardLayout>;
}
