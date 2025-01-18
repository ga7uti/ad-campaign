/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { User } from '@/types/user';
import axiosInstance from './axios-instance';
import { AxiosError } from 'axios';

class AccountClient {


    isErrorResponse(data: unknown): data is { message: Record<string, string[]> } {
      return (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as any).message === 'object'
      );
    }

    handleErrorMessage(error:AxiosError): string {
      if (error.response?.data && this.isErrorResponse(error.response.data)) {
        const errorResponse = error.response?.data
        if (errorResponse && errorResponse.message) {
          const errorMessages = Object.values(errorResponse.message);
          for (const errors of errorMessages) {
            if (Array.isArray(errors) && errors.length > 0) {
              return errors[0]; // Fallback message

            }
          }
        }
      }
      return "An unexpected error occurred. Please try again later." ;
    }

    async getUser(): Promise<User> {
      try {
        const response = await axiosInstance.get('/api/profile/', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(this.handleErrorMessage(error));
      }
    }

    async updateUser(user: User): Promise<User> {
      try {
        const response = await axiosInstance.put('/api/user/update/', user, {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
      } catch (error: any) {
        throw new Error(this.handleErrorMessage(error));
      }
    }

    async updatePassword(password:any): Promise<{success:boolean, error?:string | null}> {
      try {
        await axiosInstance.put('/api/user/change-password/', password, {
          headers: { 'Content-Type': 'application/json' },
        });
        return {success:true};
      } catch (error: any) {
        throw new Error(this.handleErrorMessage(error));
      }
    }

}

export const accountClient = new AccountClient();
