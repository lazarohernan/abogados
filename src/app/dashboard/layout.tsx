import DashboardLayout from './DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      profile={{
        full_name: 'Usuario',
        email: 'usuario@ejemplo.com',
        subscription_status: 'trial', // Estado de suscripción por defecto
        trial_end: '2024-12-31', // Fecha de vencimiento ficticia
      }}
    >
      {children}
    </DashboardLayout>
  );
}
