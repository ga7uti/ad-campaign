/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { Campaign } from '@/types/campaign';
import axiosInstance from './axios-instance';


class CampaignClient {

    async getCampaigns(): Promise<Campaign[]> {
        try {
          const response = await axiosInstance.get('/api/campaigns/', {
            headers: { 'Content-Type': 'application/json' },
          });
          return response.data;
        } catch (error: any) {
          throw new Error('Failed to fetch campaigns');
        }
      }
}

export const campaignClient = new CampaignClient();
