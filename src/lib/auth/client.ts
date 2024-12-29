'use client';

import axios from 'axios';

import type { User } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Utility function for generating tokens (browser environment only)
function generateToken(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const arr = new Uint8Array(12);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
  }
  return '';
}

// Mock user object
const user: User = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
};

// Interface Definitions
export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

// Error Handling Utility
const handleApiError = (error: any): { success: boolean; error: string } => {
  if (error.response) {
    return { success: false, error: error.response.data.detail || 'Something went wrong.' };
  }
  if (error.request) {
    return { success: false, error: 'Network error. Please check your connection.' };
  }
  return { success: false, error: 'An unexpected error occurred.' };
};

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register/`, {
        first_name: params.firstName,
        last_name: params.lastName,
        email: params.email,
        password: params.password,
      });

      if (response.status === 201 || response.status === 200) {
        const token = generateToken();
        localStorage.setItem('accessToken', token);
        return { success: true };
      }
      return { success: false, error: response.data.message || 'Registration failed' };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async signIn(params: SignInParams): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/token/`, params, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async resetPassword(params: ResetPasswordParams): Promise<{ success: boolean; error?: string }> {
    try {
      await axios.post(`${API_BASE_URL}/api/reset-password/`, params);
      return { success: true };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/logout/`, {}, { withCredentials: true });

      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return { success: true };
      }
      return { success: false, error: response.data.message || 'Logout failed' };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async getUser(): Promise<{ success: boolean; data?: User | null; error?: string }> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return { success: true, data: null };
    }
    return { success: true, data: user };
  }
}

export const authClient = new AuthClient();
