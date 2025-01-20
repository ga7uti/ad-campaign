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


  export const CampaignFormSchema: ZodType<FormData> = z.object({
    name: z.string().min(4, { message: "Name is required" }),
    age: z.array(z.string(), { message: "Age is required" }),
    environment: z.array(z.string(), { message: "Environment is required" }),
    location: z.array(z.number(), { message: "Location is required" }),
    device: z.array(z.string(), { message: "Device is required" }),
  });