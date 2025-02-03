import { Campaign, CampaignFormData } from "@/types/campaign";
import { AxiosError } from "axios";


class Utils {

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
}

export const utils = new Utils();
