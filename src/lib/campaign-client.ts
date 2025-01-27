'use client';

import { Campaign, CampaignFormData, CommonSelectResponse, ImpressionData, Interest, Location } from '@/types/campaign';
import axios from 'axios';
import axiosInstance from './axios-instance';
import { utils } from './common';


class CampaignClient {
   
    async getCampaigns(pageNo:number): Promise<{count:number,data: Campaign[]}> {
      try {
        const response = await axiosInstance.get(`/api/fetch_user_campgain/?page=${pageNo}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        return {count: response.data.count,data:response.data.results.data};
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getCampaignsById(id:number): Promise<Campaign> {
      try {
        const response = await axiosInstance.get(`/api/campaigns/${id}/`, {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.results.data;
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

    async getImpressionData() :Promise<ImpressionData>{
      try {
        const response = await axios.get('/data/impression.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getBuyType() :Promise<CommonSelectResponse[]>{
      try {
        const response = await axios.get('/data/buy_type.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
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

    async getDistinctInterest(): Promise<CommonSelectResponse[]> {
      try {
        const response = await axios.get('/data/distinct-interest.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getSelectedInterest(query:string): Promise<Interest[]> {
      try {
        const response = await axiosInstance.get(`api/target_type?query=${encodeURIComponent(query)}`, {
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

    async getBrandSafety(): Promise<CommonSelectResponse[]> {
      try {
        const response = await axios.get('/data/brand_safety.json', {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(utils.handleErrorMessage(error));
      }
    }

    async getViewability(): Promise<CommonSelectResponse[]> {
      try {
        const response = await axios.get('/data/viewability.json', {
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
