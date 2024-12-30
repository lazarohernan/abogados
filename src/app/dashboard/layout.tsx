import DashboardLayout from './DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      profile={{
        full_name: 'Usuario',
        email: 'usuario@ejemplo.com',
        subscription_status: 'active',
        trial_end: '2023-12-31',
      }}
      activeSection="chat" // Define la sección activa según la página
    >
      {children}
    </DashboardLayout>
  );
}
