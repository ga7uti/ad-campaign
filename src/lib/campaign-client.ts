/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { Campaign, CommonSelectResponse, Interest, Location } from '@/types/campaign';
import axios from 'axios';
import axiosInstance from './axios-instance';
import { utils } from './common';
import { CampaignFormData } from '@/types/form-data';


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

    async postCampaign(campaign:CampaignFormData): Promise<boolean> {
      try {
        axiosInstance.post('/api/campaigns/', campaign, {
          headers: { 'Content-Type': 'application/json' },
        });
        return true
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }


    async uploadFile(file: File,fileType:string):Promise<number> {
      const formData = new FormData();
      try {
        let uri='';
        switch(fileType){
          case 'images':
            formData.append('image', file);
            uri="campaign-images"
            break;
          case 'proximity_store':
            formData.append('file', file);
            uri="proximityStore"
            break;
          case 'proximity':
            formData.append('file', file);
            uri="proximity"
            break;
          case 'weather':
            formData.append('file', file);
            uri="weather"
            break;
          case 'keywords':
            formData.append('file', file);
            uri="keywords"
            break;
          default:
            throw new Error("Invalid File Type")
        }
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
        const response = await axiosInstance.get('/api/location', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getExchange(): Promise<CommonSelectResponse[]> {
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

    async getCarrier(): Promise<CommonSelectResponse[]> {
      try {
        const response = await axios.get('/data/carrier-data.json', {
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
