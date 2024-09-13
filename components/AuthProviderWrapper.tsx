'use client'

import { AuthProvider } from '@/contexts/AuthContext';

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}