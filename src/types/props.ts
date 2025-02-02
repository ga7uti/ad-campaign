import { SelectChangeEvent } from "@mui/material";
import { FieldError, UseFormGetValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Campaign, ImpressionData } from "./campaign";



export interface FormFieldProps<T>  {
    name: string;
    type: string;
    placeholder: string;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
    data?: T[];
    disabled?:boolean
    hidePasswordIcon?:boolean;
    multiple?:boolean;
    register: UseFormRegister<any>;
    getValues: UseFormGetValues<any>;
    setValue: UseFormSetValue<any>;
    onChange?: (event: SelectChangeEvent<unknown>, name: string) => void; // Updated type
  };

  export interface TableProps<T> {
    count?: number;
    page?: number;
    rows?: T;
    rowsPerPage?: number;
    handlePageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowClick?: (id: number,operation:string) => void;
  }

  export interface SearchProps {
    placeholder: string;
    onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void; // Correct type
  }
  
  export interface CampaignDetailsPopOverProps {
    data?:Campaign;
    onClose: () => void;
    open: boolean;
  }


  export interface FileUploadProps {
    name: string;
    placeholder: string;
    register: UseFormRegister<any>;
    getValue: UseFormGetValues<any>;
    setValue: UseFormSetValue<any>;
  }

  export interface ImpressionProps{
    title: string
    targetPopulation: number;
    totalPopulation: number;
  }

  export interface CreateCampaignProps{
    dataSources: any
    impressionData: ImpressionData;
    totalPopulation: number;
    setDataSources:any
  }