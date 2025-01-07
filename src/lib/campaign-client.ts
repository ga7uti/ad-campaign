/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { Campaign } from '@/types/campaign';
import axiosInstance from './axios-instance';
import { Location } from '@/types/location';


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

    async getLocations() :Promise<Location[]>{
      return [
        { id: 1, country: 'India', state: 'Delhi', city: 'Delhi', tier: 'Tier-I', population: 10927986 },
        { id: 2, country: 'India', state: 'Maharashtra', city: 'Mumbai', tier: 'Tier-I', population: 12691836 },
        { id: 3, country: 'India', state: 'Maharashtra', city: 'Pune', tier: 'Tier-I', population: 2935744 },
        { id: 4, country: 'India', state: 'West Bengal', city: 'Kolkata', tier: 'Tier-I', population: 4631392 },
        { id: 5, country: 'India', state: 'Gujarat', city: 'Ahmedabad', tier: 'Tier-I', population: 3719710 },
        { id: 6, country: 'India', state: 'Andhra Pradesh', city: 'Hyderabad', tier: 'Tier-I', population: 3597816 },
        { id: 7, country: 'India', state: 'Karnataka', city: 'Bangalore', tier: 'Tier-I', population: 5104047 }
      ];
    }
}

export const campaignClient = new CampaignClient();
