// src/types/profile.ts
interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    phone?: string;
    address?: string;
    subscription_status: 'trial' | 'active' | 'inactive';
    subscription_tier?: 'monthly' | 'yearly';
    stripe_customer_id?: string;
    trial_end?: string;
  }