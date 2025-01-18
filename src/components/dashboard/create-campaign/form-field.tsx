import { FormFieldProps } from '@/types/create-form';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import * as React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const FormField : React.FC<FormFieldProps<any>> = ({
    type,
    placeholder,
    name,
    register,
    error,
    valueAsNumber,
    data
  }) => (
    <div>
        <TextField
            type={type}
            fullWidth
            {...register(name,{valueAsNumber})}
            placeholder={placeholder}
            >
        </TextField>
        {error ? <FormHelperText>{error.message}</FormHelperText> : null}
    </div>
);

export default FormField;