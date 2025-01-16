/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { User } from '@/types/user';
import axiosInstance from './axios-instance';

class AccountClient {

    async getUser(): Promise<User> {
      try {
        const response = await axiosInstance.get('/api/profile/', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error('Failed to fetch campaigns');
      }
    }

    async updateUser(user: User): Promise<User> {
      try {
        const response = await axiosInstance.put('/api/user/update/', user, {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
      } catch (error: any) {
        throw new Error('Failed to update user');
      }
    }

    async updatePassword(password:any): Promise<{success:boolean, error?:string | null}> {
      try {
        await axiosInstance.put('/api/user/change-password/', password, {
          headers: { 'Content-Type': 'application/json' },
        });
        return {success:true};
      } catch (error: any) {
        return { success: false, error: error.response.data.message };
      }
    }

}

export const accountClient = new AccountClient();
