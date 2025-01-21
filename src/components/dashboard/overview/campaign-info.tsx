import React from 'react';
import { Box, Typography } from '@mui/material';

interface CampaignInfoProps {
    name:string
    value: string[];
}

const CampaignInfo: React.FC<CampaignInfoProps> = ({name,value }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ marginRight: '8px' }}>
          {name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            width: '75%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          : {value.join(', ')}
        </Typography>
      </Box>
    </Box>
  );
};

export default CampaignInfo;
