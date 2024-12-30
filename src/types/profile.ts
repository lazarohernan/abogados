interface UserProfile {
  id: string; // Identificador único obligatorio
  email: string; // Correo electrónico obligatorio
  full_name: string; // Nombre completo obligatorio
  avatar_url?: string; // URL del avatar opcional
  phone?: string; // Teléfono opcional
  address?: string; // Dirección opcional
  subscription_status: 'trial' | 'active' | 'inactive'; // Estado de la suscripción
  subscription_tier?: 'monthly' | 'yearly'; // Nivel de suscripción opcional
  stripe_customer_id?: string; // ID del cliente de Stripe opcional
  trial_end?: string | null; // Fecha de fin del periodo de prueba opcional
}

export default UserProfile;
