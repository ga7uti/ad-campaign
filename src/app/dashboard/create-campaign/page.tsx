import React from 'react';

import BackBtn from '@/components/dashboard/layout/back-btn';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import CreateCampaign from '@/components/dashboard/create-campaign/create-campaign';


export default function CreateCampaignPage(): React.JSX.Element {

  return (
    <Box>
      <BackBtn/>
      <Box mb={2}>
        <Typography mb={2} variant="h4">Create Campaign</Typography>
        <CreateCampaign/>
      </Box>
    </Box>
  );
}
