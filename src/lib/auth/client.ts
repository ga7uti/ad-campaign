/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

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

// Error Handling Utility
const handleApiError = (error: any): { success: boolean; error: string } => {
  if (error.response) {
    return { success: false, error: error.response.data.error.message || 'Something went wrong.' };
  }
  if (error.request) {
    return { success: false, error: 'Network error. Please check your connection.' };
  }
  return { success: false, error: 'An unexpected error occurred.' };
};

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axiosInstance.post(`/api/register/`, {
        first_name: params.firstName,
        last_name: params.lastName,
        email: params.email,
        password: params.password,
      });

      if (response.status === 201 || response.status === 200) {
        return { success: true };
      }
      return { success: false, error: response.data.message || 'Registration failed' };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async signIn(params: SignInParams): Promise<{ success: boolean; data?: any; error?: string }> {

    try {

      const response = await axiosInstance.post('/api/token/', params, {
        headers: { 'Content-Type': 'application/json' },
      });
      // Access the nested data object
      const responseData = response.data.data;
      const { access, refresh, user_type } = responseData;
      if (!access || !refresh) {
        console.error('5a. Missing tokens:', { access, refresh });
        throw new Error('Invalid tokens');
      }
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('usertype', user_type ? 'admin' : 'user');
      return { success: true, data: responseData };
    } catch (error: any) {
      console.error('ERROR:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      return { success: false, error: error.message };
    }
  }

  async resetPassword(params: ResetPasswordParams): Promise<{ success: boolean; error?: string }> {
    try {
      await axiosInstance.post(`/api/reset-password/`, params);
      return { success: true };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await axiosInstance.post(`/api/logout/`,{ refresh: localStorage.getItem('refreshToken') },{ withCredentials: true });
    } catch (error: any) {
      console.error('Error:', error);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    return { success: true };
  }

  async getToken(): Promise<{ success: boolean; data?: string | null; error?: string }> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return { success: true, data: null };
    }
    return { success: true, data: token };
  }
}

export const authClient = new AuthClient();
