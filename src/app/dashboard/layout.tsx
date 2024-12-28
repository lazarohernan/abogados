import DashboardLayout from './DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      profile={{
        full_name: 'Usuario de Prueba',
        email: 'usuario@ejemplo.com',
        subscription_status: 'active',
        trial_end: '2024-12-31',
      }}
    >
      {children}
    </DashboardLayout>
  );
}
