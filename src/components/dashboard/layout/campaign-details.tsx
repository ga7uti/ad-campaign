import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { CampaignDetailsPopOverProps } from '@/types/form-data';
 
  export function CampaignDetailsPopOver({ anchorEl, onClose, open, data }: CampaignDetailsPopOverProps): React.JSX.Element {
  
    return (
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
        onClose={onClose}
        open={open}
        slotProps={{ paper: { sx: { width: '512px' } } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2">{data?.name}</Typography>  
        </Box>
      </Popover>
    );
  }
  