/* eslint-disable -- Disabling all Eslint rules for the file */

import React from 'react';
import { CommonSelectResponse, Location } from '@/types/campaign';
import { FormFieldProps } from '@/types/form-data';
import {
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';

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

const FormField: React.FC<FormFieldProps<any>> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
  data,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <FormControl fullWidth error={Boolean(error)} margin="normal">
      {!data ? (
        <TextField
          type={type === 'password' && showPassword ? 'text' : type}
          fullWidth
          disabled={disabled}
          label={placeholder}
          {...register(name, { valueAsNumber })}
          InputProps={
            type === 'password'
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined
          }
        />
      ) : (
        <FormControl fullWidth>
          <InputLabel id="select-label">{placeholder}</InputLabel>
          <Select
            fullWidth
            {...register(name, { valueAsNumber })}
            multiple
            MenuProps={MenuProps}
            label={placeholder}
            defaultValue={[]}
            labelId="select-label"
          >
            {(() => {
              switch (name) {
                case 'location':
                  return data.map((val: Location) => (
                    <MenuItem key={val.id} value={val.id}>
                      {val.city}
                    </MenuItem>
                  ));

                default:
                  return data.map((val: CommonSelectResponse) => (
                    <MenuItem key={val.id} value={val.value}>
                      {val.value}
                    </MenuItem>
                  ));
              }
            })()}
          </Select>
        </FormControl>
      )}

      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default FormField;
