import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { SearchProps } from '@/types/form-data';

export function Search({
    placeholder,
    onSearch
}:SearchProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2, borderRadius: 0 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
        onChange={onSearch}
      />
    </Card>
  );
}