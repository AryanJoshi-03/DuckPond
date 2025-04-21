"use client";

import { useEffect, useState } from 'react';
import { getTokenPayload } from '@/lib/jwt';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      console.log('useAuth: Starting to load user');
      const payload = await getTokenPayload();
      console.log('useAuth: Received payload:', payload);
      setUser(payload);
      setLoading(false);
      console.log('useAuth: Updated user state:', payload);
    }
    
    loadUser();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
} 