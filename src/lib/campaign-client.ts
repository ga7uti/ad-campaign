/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { Age, Campaign, Interest, Location, Partners } from '@/types/campaign';
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

    getDistinctInterest():string[]{
      const categories = new Set<string>();
      this.getAudienceInterest().forEach(item => categories.add(item.name));
      return Array.from(categories);
    }

    getSelectedInterest(interests:string[]):Interest[]{
      return this.getAudienceInterest().filter(item => interests.includes(item.name));
    }
  
    getAudienceInterest(): Interest[] {
      return [
        {
          id: 1,
          name: "Affinity Audiences",
          subcategory: "Vehicles & Transportation > Auto Enthusiasts > Performance & Luxury Vehicle Enthusiasts"
        },
        {
          id: 2,
          name: "Affinity Audiences",
          subcategory: "Vehicles & Transportation > Auto Enthusiasts > Truck & SUV Enthusiasts"
        },
        {
          id: 3,
          name: "Affinity Audiences",
          subcategory: "Vehicles & Transportation > Transportation Modes"
        },
        {
          id: 4,
          name: "Affinity Audiences",
          subcategory: "Vehicles & Transportation > Transportation Modes > Public Transit Users"
        },
        {
          id: 5,
          name: "Affinity Audiences",
          subcategory: "Vehicles & Transportation > Transportation Modes > Taxi Service Users"
        },
        {
          id: 6,
          name: "In-Market Audiences",
          subcategory: "Apparel & Accessories"
        },
        {
          id: 7,
          name: "In-Market Audiences",
          subcategory: "Apparel & Accessories > Activewear"
        },
        {
          id: 8,
          name: "Detailed Demographics",
          subcategory: "Parental Status > Parents > Parents of Infants (0-1 years)"
        },
        {
          id: 9,
          name: "Detailed Demographics",
          subcategory: "Parental Status > Parents > Parents of Toddlers (1-3 years)"
        },
        {
          id: 10,
          name: "Detailed Demographics",
          subcategory: "Parental Status > Parents > Parents of Preschoolers (4-5 years)"
        },
        {
          id: 11,
          name: "Detailed Demographics",
          subcategory: "Parental Status > Parents > Parents of Grade-Schoolers (6-12 years)"
        },
        {
          id: 12,
          name: "Detailed Demographics",
          subcategory: "Parental Status > Parents > Parents of Teens (13-17 years)"
        },
        {
          id: 13,
          name: "Detailed Demographics",
          subcategory: "Marital Status > Single"
        },
        {
          id: 14,
          name: "Detailed Demographics",
          subcategory: "Marital Status > In a Relationship"
        },
        {
          id: 15,
          name: "In-Market Audiences",
          subcategory: "Apparel & Accessories > Backpacks"
        },
        {
          id: 16,
          name: "In-Market Audiences",
          subcategory: "Apparel & Accessories > Activewear > Running Apparel"
        },
        {
          id: 17,
          name: "In-Market Audiences",
          subcategory: "Apparel & Accessories > Activewear > Yoga Apparel"
        },
        {
          id: 18,
          name: "Topics",
          subcategory: "Arts & Entertainment > Entertainment Industry > Recording Industry"
        },
        {
          id: 19,
          name: "Topics",
          subcategory: "Arts & Entertainment > Entertainment Industry > Recording Industry > Music Awards"
        },
        {
          id: 20,
          name: "Topics",
          subcategory: "Arts & Entertainment > Entertainment Industry > Recording Industry > Record Labels"
        },
        {
          id: 21,
          name: "Topics",
          subcategory: "Arts & Entertainment > Events & Listings"
        },
        {
          id: 22,
          name: "Topics",
          subcategory: "Arts & Entertainment > Events & Listings > Bars, Clubs & Nightlife"
        },
        {
          id: 23,
          name: "Topics",
          subcategory: "Arts & Entertainment > Events & Listings > Concerts & Music Festivals"
        },
        {
          id: 24,
          name: "Topics",
          subcategory: "Arts & Entertainment > Events & Listings > Event Ticket Sales"
        },
        {
          id: 25,
          name: "Topics",
          subcategory: "Arts & Entertainment > Events & Listings > Expos & Conventions"
        },
        {
          id: 26,
          name: "Topics",
          subcategory: "Arts & Entertainment > Events & Listings > Film Festivals"
        }
      ]
      
    }
}

export const campaignClient = new CampaignClient();
