/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { Age, Campaign, Location, Partners } from '@/types/campaign';
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

    async getAdPartners(): Promise<Partners[]> {
      return [
        { id: 1, name: 'InMobi' },
        { id: 2, name: 'OpenX' },
        { id: 3, name: 'ImproveDigital' },
        { id: 4, name: 'Pubmatic' },
        { id: 5, name: 'Xandr' },
        { id: 6, name: 'M|SSP' },
        { id: 7, name: 'GoogleAdx' },
        { id: 8, name: 'Magnite' },
        { id: 9, name: 'Triplelift' },
        { id: 10, name: 'Smaato' },
        { id: 11, name: 'Equativ' },
        { id: 12, name: 'Medialink-X' },
        { id: 13, name: 'Index Exchange' },
        { id: 14, name: 'Axonix' },
        { id: 15, name: 'ADS' }
      ];
    }

    async getAge(): Promise<Age[]> {
      return [
        { id: 1, range: '25' },
        { id: 2, range: '26-35' },
        { id: 3, range: '36-45' },
        { id: 4, range: '46-55' },
        { id: 5, range: '56-65' },
        { id: 6, range: '56-65' },
        { id: 7, range: '65+' },
      ]
    }
}

export const campaignClient = new CampaignClient();
