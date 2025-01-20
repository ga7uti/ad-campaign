/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { Campaign, CommonSelectResponse, Interest, Location, Partners } from '@/types/campaign';
import axios from 'axios';
import axiosInstance from './axios-instance';
import { utils } from './common';


class CampaignClient {
   
    async getCampaigns(): Promise<Campaign[]> {
      try {
        const response = await axiosInstance.get('/api/fetch_user_campgain/', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async uploadFile(files: FileList,fileType:string):Promise<number> {
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
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getLocations() :Promise<Location[]>{
      try {
        const response = await axios.get('/data/location.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getAdPartners(): Promise<Partners[]> {
      try {
        const response = await axios.get('/data/exchange.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getAudienceInterest(): Promise<Interest[]> {
      try {
        const response = await axios.get('/data/location.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getAge(): Promise<CommonSelectResponse[]> {
      try {
        const response = await axios.get('/data/age.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getDevice(): Promise<CommonSelectResponse[]> {
      try {
        const response = await axios.get('/data/device.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getEnv(): Promise<CommonSelectResponse[]> {
      try {
        const response = await axios.get('/data/environment.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getLanguage(): Promise<CommonSelectResponse[]> {
      try {
        const response = await axios.get('/data/language.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getDevicePrice(): Promise<CommonSelectResponse[]> {
      try {
        const response = await axios.get('/data/device-price.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }
    
    // async getTargetPopulation(selectedLocations:number[],locations:Location[]):number{
    //   let targetLocation = 0;
    //   selectedLocations.forEach(selectedLocation =>{
    //     const location = locations.filter(val=> val.id === selectedLocation);
    //     targetLocation = targetLocation+location[0].population;
    //   })
    //   return targetLocation;
    // }
}

export const campaignClient = new CampaignClient();
