import { FieldError, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod"; // Add new import

export type FormData = {
    name: string;
    age: string[];
    device: string[];
    environment: string[];
    location: number[];
};

  export type FormFieldProps<T> = {
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<FormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
    data: T[] | undefined;
  };


  export type ValidFieldNames =
  | "name"
  | "age"
  | "device"
  | "environment"
  | "location"


  export const CampaignFormSchema: ZodType<FormData> = z
  .object({
    name: z.string().min(4, { message: 'Name is required' }),
    age: z.string().array().min(1,{ message: 'Age is required' }),
    device: z.string().array().min(1,{ message: 'Device is required' }),
    environment: z.string().array().min(1,{ message: 'Environment is required' }),
    location: z.number().array().min(1,{ message: 'Location is required' }),
  })