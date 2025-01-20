import { FormFieldProps } from '@/types/create-form';
import { FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
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
      {!data?
        <div>
            <InputLabel>{placeholder}</InputLabel>
            <TextField
                type={type}
                fullWidth
                {...register(name,{valueAsNumber})}
                >
            </TextField>
          </div>
          : 
          <div>
            <InputLabel>{placeholder}</InputLabel>
            <Select
              type={type}
              fullWidth
              {...register(name, { valueAsNumber })}
              multiple
              MenuProps={MenuProps}
              defaultValue={[]}
            >
              {(() => {
                switch (name) {
                  case "location":
                    return data.map((val: any) => (
                      <MenuItem key={val.id} value={val.id}>
                        {val.city}
                      </MenuItem>
                    ));

                  default:
                    return data.map((val: any) => (
                      <MenuItem key={val.id} value={val.value}>
                        {val.value}
                      </MenuItem>
                    ));
                }
              })()}
            </Select>
          </div>
        }
        {error ? <FormHelperText>{error.message}</FormHelperText> : null}
    </div>
);

export default FormField;