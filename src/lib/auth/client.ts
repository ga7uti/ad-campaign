/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { Auth } from '@/types/auth';
import axiosInstance from '../axios-instance';

// Interface Definitions
export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axiosInstance.post(`/api/register/`, {
        first_name: params.firstName,
        last_name: params.lastName,
        email: params.email,
        password: params.password,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response.data.message };
    }
  }

  async signIn(params: SignInParams): Promise<{ success: boolean; data?: any; error?: string }> {
    try {

      const response = await axiosInstance.post('/api/token/', params, {
        headers: { 'Content-Type': 'application/json' },
      });
      const responseData = response.data.data;
      const { access, refresh, user_type } = responseData;
      if (!access || !refresh) {
        throw new Error('Invalid tokens');
      }
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('usertype', user_type ? 'admin' : 'user');
      return { success: true, data: responseData };
    } catch (error: any) {
      return { success: false, error: error.response.data.message.non_field_errors };
    }
  }

  async resetPassword(params: ResetPasswordParams): Promise<void> {
    try {
      await axiosInstance.post(`/api/reset-password/`, params);
    } catch (error: any) {
      console.error('Error:', error);
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await axiosInstance.post(`/api/logout/`,{ refresh: localStorage.getItem('refreshToken') },{ withCredentials: true });
    } catch (error: any) {
      console.error('Error:', error);
    }
    this.clearLocalStorage()
    return { success: true };
  }

  async refreshToken(): Promise<string> {
    const token = localStorage.getItem('refreshToken');
    if (token) {
      return (await axiosInstance.post('/api/token/refresh/', { refresh: token })).data.access;
    }
    throw new Error('Failed to refresh token');
  }

  async getAuth(): Promise<{ success: boolean; data?: Auth | null; error?: string }> {
    const token = localStorage.getItem('accessToken');
    const usertype = localStorage.getItem('usertype');
    if (!token || !usertype) {
      return { success: true, data: null };
    }
    return { success: true, data: { token:token, usertype:usertype } };
  }

  clearLocalStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
  };
}

export const authClient = new AuthClient();
