import { Campaign, CampaignFormData, Interest, Location } from "@/types/campaign";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { UseFormGetValues } from "react-hook-form";


class Utils {
    
    reviewFields = [
        { label: "CampaignName", name: "name" },
        { label: "CampaignType", name: "objective" },
        { label: "Start Time", name: "start_time" },
        { label: "End Time", name: "end_time" },
        { label: "Locations", name: "location" },
        { label: "AgeRange", name: "age" },
        { label: "Exchange", name: "exchange" },
        { label: "Language", name: "language" },
        { label: "Viewability", name: "viewability" },
        { label: "BrandSafety", name: "brand_safety" },
        { label: "Devices", name: "device" },
        { label: "Environments", name: "environment" },
        { label: "Carrier", name: "carrier" },
        { label: "DevicePrice", name: "device_price" },
        { label: "Interest", name: "target_type" },
        { label: "TotalBudget", name: "total_budget" },
        { label: "BuyType", name: "buy_type" },
        { label: "UnitRate", name: "unit_rate" },
        { label: "LandingPage", name: "landing_page" },
        { label: "Tag&Tracker", name: "tag_tracker" },
        { label: "Image", name: "images" },
        { label: "Video", name: "video" },
        { label: "Keywords", name: "keywords" },
    ];

    isErrorResponse(data: unknown): data is { message: Record<string, string[]> } {
        return (
          typeof data === 'object' &&
          data !== null &&
          'message' in data &&
          typeof (data as any).message === 'object' || typeof (data as any).message === 'string'
        );
    }
    
    handleErrorMessage(error:AxiosError): string {
    if (error.response?.data && this.isErrorResponse(error.response.data)) {
        const errorResponse = error.response?.data
        if (errorResponse && errorResponse.message) {
            if(typeof errorResponse.message === 'string')
                return errorResponse.message;

            const errorMessages = Object.values(errorResponse.message);
            for (const errors of errorMessages) {
                if (Array.isArray(errors) && errors.length > 0) {
                    return errors[0]; 
                }
            }
        }
        
    }else if(error.response?.data && typeof error.response?.data === 'object'){
        const errorMessages = Object.values(error.response?.data);
        for (const errors of errorMessages) {
            if (Array.isArray(errors) && errors.length > 0) {
                return errors[0]; 
            }
        }
    }
    return "An unexpected error occurred. Please try again later." ;
    }

    transformCampaignToFormData(campaign: Campaign): CampaignFormData {
        return {
          name: campaign.name,
          objective: campaign.objective,
          age: campaign.age,
          device: campaign.device,
          environment: campaign.environment,
          location: campaign.location.map(loc => loc.id),
          images: campaign.images.map(img => img.id),
          keywords: campaign.keywords.map(kw => kw.id),
          target_type: campaign.target_type.map(interest => interest.id),
          exchange: campaign.exchange,
          language: campaign.language,
          carrier: campaign.carrier,
          device_price: campaign.device_price,
          landing_page: campaign.landing_page,
          tag_tracker: campaign.tag_tracker.map(tag => tag.id), 
          total_budget: campaign.total_budget,
          buy_type: campaign.buy_type,
          unit_rate: campaign.unit_rate,
          viewability: campaign.viewability, 
          brand_safety: campaign.brand_safety, 
          video: campaign.video.map(v => v.id),
          start_time: campaign.start_time,
          end_time: campaign.end_time
        };
    }

    formatTargetIdToSubCategory(values:number[],targetTypeList:Interest[]){
        return values.map((interest) => { 
                const temp = targetTypeList.find((i) => i.id === interest);
                return temp ? temp.category + ">" + temp.subcategory : "Unknown";
        }).join(", ");
    }

    formatLocationIdToCity(values: number[], locationList: Location[]): string {
        return values.map((loc) => {
            const location = locationList.find((l) => l.id === loc);
            return location ? location.city : "Unknown";
        }).join(", ");
    }

    formatAndGetReviewData = (name: string,dataSources:any,getValues:UseFormGetValues<CampaignFormData>): string => {
        const value = getValues(name as keyof CampaignFormData);
        if (value) {
            switch (name) {
                case "location":
                    return utils.formatLocationIdToCity(value as number[], dataSources.location as Location[]);
                case "target_type":
                    return utils.formatTargetIdToSubCategory(value as number[], dataSources.interest as Interest[]);
                case "start_time":
                case "end_time":
                    return dayjs(value as number).format("YYYY-MM-DD");
                case "images":
                case "video":
                case "keywords":
                    return (value as unknown as FileList).length !== 0 ? "File uploaded" : "Not Provided";
                default:
                    return value as string;
            }
        }
        return "Not provided";
    };

}

export const utils = new Utils();
