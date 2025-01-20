import { FieldError, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod"; // Add new import
import { User } from "./user";
import { CampaignFormData } from "./campaign";

  export interface FormFieldProps<T>  {
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<any>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
    data?: T[];
    disabled?:boolean
  };


  export type ValidFieldNames =
  | "name"
  | "age"
  | "device"
  | "environment"
  | "location"
  | "images"
  | "keywords"
  | "exchange"
  | "language"
  | "carrier"
  | "device_price"
  | "proximity_store"
  | "proximity"
  | "weather"
  | "first_name"
  | "last_name"
  | "email"
  | "phone_no"


  export const CampaignFormSchema: ZodType<CampaignFormData> = z.object({
    name: z.string().min(4, { message: "Name is required" }),
    age: z.array(z.string(), { message: "Age is required" }),
    environment: z.array(z.string(), { message: "Environment is required" }),
    location: z.array(z.number(), { message: "Location is required" }),
    device: z.array(z.string(), { message: "Device is required" }),
    images: z.array(z.number(), { message: "Image is required" }),
    keywords: z.array(z.number(), { message: "Keywords is required" }),
    exchange: z.array(z.string(), { message: "Exchange is required" }),
    language: z.array(z.string(), { message: "Language is required" }),
    carrier: z.array(z.string(), { message: "Carrier is required" }),
    device_price: z.array(z.string(), { message: "Device Price is required" }),
    proximity_store: z.any(),
    proximity: z.any(),
    weather: z.any(),
  });


  export const profileSchema: ZodType<User> = z.object({
    first_name: z.string().min(5, { message: 'First name  is required & must be at least 5 characters long' }),
    last_name: z.string().min(5, { message: 'Last name  is required & must be at least 5 characters long' }),
    phone_no: z.string().regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' }),
    email: z.string().email({ message: 'Email is required' })
  });
  