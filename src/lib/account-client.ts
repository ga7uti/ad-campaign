/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { User } from '@/types/user';
import axiosInstance from './axios-instance';


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
}

export const accountClient = new AccountClient();
