import { SelectChangeEvent } from "@mui/material";
import { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { z, ZodType } from "zod";
import { SignInParams, User } from "./auth";
import { Campaign, CampaignFormData } from "./campaign";

  export interface FormFieldProps<T>  {
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
    data?: T[];
    disabled?:boolean
    hidePasswordIcon?:boolean;
    multiple?:boolean;
    onChange?: (event: SelectChangeEvent<unknown>, name: string) => void; // Updated type
  };

  export interface TableProps<T> {
    count?: number;
    page?: number;
    rows?: T;
    rowsPerPage?: number;
    handlePageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowClick: (id: number) => void;
  }

  export interface SearchProps {
    placeholder: string;
    onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void; // Correct type
  }
  
  export interface CampaignDetailsPopOverProps {
    data?:Campaign;
    anchorEl: Element | null;
    onClose: () => void;
    open: boolean;
  }


  export interface FileUploadProps {
    name: string;
    placeholder: string;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>; // Add setValue to update form state
  }

  export interface ImpressionProps{
    title: string
    targetPopulation: number;
    totalPopulation: number;
}




  export const CampaignFormSchema: ZodType<CampaignFormData> = z.object({
    name: z.string().min(4, { message: "Name is required" }),
    age: z.array(z.string(), { message: "Age is required" }),
    environment: z.array(z.string(), { message: "Environment is required" }),
    location: z.array(z.number(), { message: "Location is required" }),
    device: z.array(z.string(), { message: "Device is required" }),
    distinct_interest: z.array(z.string(), { message: "Interest is required" }),
    target_type: z.array(z.number(), { message: "Interest is required" }),
    exchange: z.array(z.string(), { message: "Exchange is required" }),
    language: z.array(z.string(), { message: "Language is required" }),
    carrier: z.array(z.string(), { message: "Carrier is required" }),
    device_price: z.array(z.string(), { message: "Device Price is required" }), 
    total_budget: z.number({ message: "Total Budget is required" }),
    buy_type: z.string({ message: "Buy Type is required" }),
    unit_rate: z.number({ message: "Unit Rate is required" }),
    brand_safety: z.string({ message: "Brand Safety is required" }),
    viewability: z.string({ message: "Viewability is required" }),
    images: z.any(),
    video: z.any(),
    keywords: z.any(),
    landing_page: z.any(),
    tag_tracker: z.any(),
  });


  export const profileSchema: ZodType<User> = z.object({
    first_name: z.string().min(5, { message: 'First name  is required & must be at least 5 characters long' }),
    last_name: z.string().min(5, { message: 'Last name  is required & must be at least 5 characters long' }),
    phone_no: z.string().regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' }),
    email: z.string().email({ message: 'Email is required' })
  });

  export const signInSchema: ZodType<SignInParams> = z.object({
    username: z.string().min(1, { message: 'Email is required' }).email(),
    password: z.string().min(1, { message: 'Password is required' }),
  });
  

  export const signUpSchema: ZodType<User> = z.object({
    first_name: z.string().min(5, { message: 'First name must be at least 5 characters long' }),
    last_name: z.string().min(5, { message: 'Last name must be at least 5 characters long' }),
    email: z.string().min(1, { message: 'Email is required' }).email(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must include at least one uppercase letter, one number, and one special character'
      ),
    terms: z.boolean().refine((value) => value, 'You must accept the terms and conditions'),
  });


  export const updatePaswordSchema = z.object({
    old_password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must include at least one uppercase letter, one number, and one special character'
      ),
    new_password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must include at least one uppercase letter, one number, and one special character'
      ),
      confirm_new_password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        'Password must include at least one uppercase letter, one number, and one special character'
      ),
    }).refine((data) => data.new_password === data.confirm_new_password, {
      message: "Passwords don't match",
      path: ['confirm_new_password'],
  });