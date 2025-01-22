import { CampaignFormData } from "@/types/campaign";
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

      validateMandatoryFields(data: CampaignFormData): Record<string, string> {
        const mandatoryFields: (keyof CampaignFormData)[] = [
          "name",
          "age",
          "device",
          "environment",
          "location",
          "images",
          "keywords",
          "exchange",
          "language",
          "carrier",
          "device_price",
        ];
      
        const errors: Record<string, string> = {};
        
        mandatoryFields.forEach((field) => {
          if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
            const capitalizeFirstLetter = field.charAt(0).toUpperCase() + field.slice(1);
            errors[field] = `${capitalizeFirstLetter} is a mandatory field and cannot be empty.`;
          }
        });
      
        return errors;
      }
}

export const utils = new Utils();
