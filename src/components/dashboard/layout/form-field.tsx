import { CommonSelectResponse, Interest, Location } from '@/types/campaign';
import { FormFieldProps } from '@/types/props';
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
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import dayjs from 'dayjs';
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
  hidePasswordIcon = false,
  multiple = true,
  onChange,
  getValues,
  setValue
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const labelId = `${name}-label`; // Unique label ID for Select

  // Handle Checkbox Type
  const renderCheckbox = () => (
    <FormControlLabel
      control={<Checkbox {...register(name)} />}
      label={
        <React.Fragment>
          <a href="/terms">{placeholder}</a>
        </React.Fragment>
      }
    />
  );

  // Handle TextField Types (text, password, etc.)
  const renderTextField = () => (
    <TextField
      type={type === 'password' && showPassword ? 'text' : type}
      fullWidth
      multiline = {type === 'textarea' ? true : false}
      maxRows={4}
      disabled={disabled}
      {...register(name, { valueAsNumber })}
      label={placeholder}
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
  );

  // Handle Select Types
  const renderSelect = () => {
    const renderMenuItems = () => {
      switch (name) {
        case 'location':
          return data?.map((val: Location) => (
            <MenuItem key={val.id} value={val.id}>
              {val.city}
            </MenuItem>
          ));

        case 'distinct_interest':
          return data?.map((val: CommonSelectResponse) => (
            <MenuItem key={val.id} value={val.value}>
              {val.value}
            </MenuItem>
          ));

        case 'target_type':
          return data?.map((val: Interest) => (
            <MenuItem key={val.id} value={val.id}>
              {val.subcategory}
            </MenuItem>
          ));

        default:
          return data?.map((val: CommonSelectResponse) => (
            <MenuItem key={val.id} value={val.value}>
              {val.label}
            </MenuItem>
          ));
      }
    };

    return (
      <>
        <InputLabel id={labelId}>{placeholder}</InputLabel>
        <Select
          fullWidth
          {...register(name, { valueAsNumber })}
          multiple={multiple}
          MenuProps={MenuProps}
          defaultValue={getValues && getValues(name) ? getValues(name) : multiple ? [] : ''}
          label={placeholder}
          labelId={labelId}
          onChange={(e) => onChange && onChange(e, name)}
        >
          {renderMenuItems()}
        </Select>
      </>
    );
  };

  // Handle DatePicker Type
  const renderDatePicker = () => {
    const value = getValues ? getValues(name) : new Date();
    const minDate = new Date();
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label={placeholder}
          value={value}
          minDate={minDate}
          {...register(name, { valueAsNumber })}
          onChange={(date) => setValue && setValue(name, dayjs(date).format('YYYY-MM-DD'))}
        />
      </LocalizationProvider>
    );
  };

  // Render the appropriate field based on the type
  const renderField = () => {
    switch (type) {
      case 'checkbox':
        return renderCheckbox();
      case 'text':
      case 'password':
      case 'number':
      case 'email':
      case 'textarea':
        return renderTextField();
      case 'select':
        return renderSelect();
      case 'datepicker':
        return renderDatePicker();
      default:
        return null;
    }
  };

  return (
    <FormControl fullWidth error={Boolean(error)}>
      {renderField()}
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default FormField;