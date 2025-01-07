/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { User } from '@/types/user';
import axiosInstance from './axios-instance';


export interface UpdatePassword {
  old_password: string;
  new_password: string;
  confirm_new_password:string
}

class AccountClient {

    async getUser(): Promise<User> {
      try {
        const response = await axiosInstance.get('/api/user/', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
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

    async updatePassword(password: UpdatePassword): Promise<{success:boolean, error?:string | null}> {
      try {
        const response = await axiosInstance.put('/api/user/change-password/', password, {
          headers: { 'Content-Type': 'application/json' },
        });
        return {success:true};
      } catch (error: any) {
        return {success:false, error:error.response.data.error};
      }
    }

}

export const accountClient = new AccountClient();
