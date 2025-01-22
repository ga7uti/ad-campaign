'use client';

import { Auth, Customer, ResetPasswordParams, SignInParams, User } from '@/types/auth';
import axiosInstance from './axios-instance';
import { utils } from './common';

class AuthClient {
  async signUp(user: User): Promise<boolean> {
    try {
      await axiosInstance.post(`/api/register/`, user);
      return true
    } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
    }
  }

  async signIn(params: SignInParams): Promise<boolean> {
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
      return true
    } catch (error: any) {
      throw new Error(utils.handleErrorMessage(error));
    }
  }

  async resetPassword(params: ResetPasswordParams): Promise<void> {
    try {
      await axiosInstance.post(`/api/reset-password/`, params);
    } catch (error: any) {
      throw new Error(utils.handleErrorMessage(error));
    }
  }

  async signOut(): Promise<boolean> {
    try {
      await axiosInstance.post(`/api/logout/`,{ refresh: localStorage.getItem('refreshToken') },{ withCredentials: true });
    } catch (error: any) {
      console.error('Error:', error);
    }
    this.clearLocalStorage()
    return true;
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

     
  async getCustomers(pageNo:number): Promise<{totalCount:number,data: Customer[]}> {
    try {
      const response = await axiosInstance.get(`/api/users/?page=${pageNo}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return {totalCount: response.data.count,data:response.data.results};
    } catch (error: any) {
      throw new Error(utils.handleErrorMessage(error));
    }
  }
}

export const authClient = new AuthClient();
