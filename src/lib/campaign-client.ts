/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { Campaign } from '@/types/campaign';
import axiosInstance from './axios-instance';


class CampaignClient {
  
    async getCampaigns(): Promise<Campaign[]> {
      try {
        const response = await axiosInstance.get('/api/fetch_user_campgain/', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
      } catch (error: any) {
        throw new Error('Failed to fetch campaigns');
      }
    }

    async uploadLogo(files: FileList,fileType:string):Promise<number> {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append(fileType, files[i]);
      }
      try {
        const uri = fileType=='image'?'campaign-images':'campaign-logos';
        const response = await axiosInstance.post(`/api/${uri}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.id;
      } catch (error: any) {
        throw new Error('Failed to upload logos');
      }
    }
}

export const campaignClient = new CampaignClient();
