import { FieldError, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod"; // Add new import

export type FormData = {
    name: string;
    age: string[];
};

  export type FormFieldProps<T> = {
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<FormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
    data: T[] | undefined
  };


  export type ValidFieldNames =
  | "name"
  | "age"


  export const CampaignFormSchema: ZodType<FormData> = z
  .object({
    name: z.string().min(4, { message: 'Name is required' }),
    age: z.string().array().min(1,{ message: 'Age is required' })
  })