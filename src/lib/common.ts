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
            
        }
        return "An unexpected error occurred. Please try again later." ;
      }
}

export const utils = new Utils();
