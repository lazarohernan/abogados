import DashboardLayout from './DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      profile={{
        full_name: 'Usuario',
        email: 'usuario@ejemplo.com',
        subscription_status: 'active', // Sustituir con datos reales si están disponibles
        trial_end: '2023-12-31',
      }}
      activeSection="chat" // Cambiar según la sección activa
    >
      {children}
    </DashboardLayout>
  );
}
