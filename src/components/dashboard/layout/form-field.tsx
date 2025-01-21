/* eslint-disable -- Disabling all Eslint rules for the file*/
import { CommonSelectResponse, Interest, Location } from '@/types/campaign';
import { FormFieldProps } from '@/types/form-data';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import React from 'react';

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
  hidePasswordIcon=false,
  onChange
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const labelId = `${name}-label`; // Unique label ID for Select

  return (
    <FormControl fullWidth error={Boolean(error)}>
      {type === 'checkbox' ? (
        // Handle Checkbox Type
        <FormControlLabel
          control={<Checkbox {...register(name)} />}
          label={
            <React.Fragment>
               <a href="/terms">{placeholder}</a>
            </React.Fragment>
          }
        />
      ) : !data ? (
        // Handle TextField Types
        <TextField
          type={type === 'password' && showPassword ? 'text' : type}
          fullWidth
          disabled={disabled}
          {...register(name, { valueAsNumber })}
          label={placeholder} // Label for the text field
          InputProps={
            type === 'password' && !hidePasswordIcon
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
        // Handle Select Types
        <>
          <InputLabel id={labelId}>{placeholder}</InputLabel>
          <Select
            fullWidth
            {...register(name, { valueAsNumber })}
            multiple
            MenuProps={MenuProps}
            defaultValue={[]}
            label={placeholder}
            labelId={labelId}
            onChange={(e) => onChange && onChange(e, name)}
          >
            {(() => {
              switch (name) {
                case 'location':
                  return data.map((val: Location) => (
                    <MenuItem key={val.id} value={val.id}>
                      {val.city}
                    </MenuItem>
                  ));

                  case 'distinct_interest':
                  return data.map((val: CommonSelectResponse) => (
                    <MenuItem key={val.id} value={val.value}>
                      {val.value}
                    </MenuItem>
                  ));

                  case 'target_type':
                  return data.map((val: Interest) => (
                    <MenuItem key={val.id} value={val.id}>
                      {val.category}
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
        </>
      )}

      {/* Error Handling */}
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default FormField;
