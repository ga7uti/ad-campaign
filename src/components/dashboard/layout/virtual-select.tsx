import { VirtualizedDropdownProps } from '@/types/form-data';
import { InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { FixedSizeList } from 'react-window';



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

const VirtualizedDropdown: React.FC<VirtualizedDropdownProps<any>> = ({
  name,
  register,
  placeholder,
  data,
}) => {
    const labelId = `${name}-label`;
    return (
        <>
            <InputLabel id={labelId}>{placeholder}</InputLabel>
            <Select
                fullWidth
                {...register(name)}
                multiple
                MenuProps={MenuProps}
                defaultValue={[]}
                label={placeholder}
                labelId={labelId}
            >
            </Select>
        </>
    );
}

export default VirtualizedDropdown;
