import DashboardLayout from './DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      profile={{
        full_name: 'Usuario',
        email: 'usuario@ejemplo.com',
        subscription_status: 'inactive', // Valor predeterminado
        trial_end: null, // Valor nulo como ejemplo
      }}
    >
      {children}
    </DashboardLayout>
  );
}
