import React from 'react';
import {
  FormHelperText,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputAdornment,
  IconButton,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { CommonSelectResponse, Location } from '@/types/campaign';
import { FormFieldProps } from '@/types/form-data';

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
  hidePasswordIcon=false
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
            labelId={labelId} // Associate the label with the Select
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
        </>
      )}

      {/* Error Handling */}
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default FormField;
