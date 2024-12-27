"use client";

import React from 'react';

import BudgerBidding from '@/components/dashboard/create-campaign/BudgetBidding';
import CampaignSetting from '@/components/dashboard/create-campaign/CampaignSetting';
import { IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBendDownLeft } from '@phosphor-icons/react/dist/ssr';


export default function CreateCampaignPage(): React.JSX.Element {
  function handleBack(): void {
    window.history.back();
  }

  return (
    <Box>
      <Box mb={2}>
        <IconButton onClick={handleBack}>
          <ArrowBendDownLeft/>
        </IconButton>
      </Box>
      <Box mb={2}>
        <Typography mb={2} variant="h4">Create Campaign</Typography>
        <CampaignSetting/>
      </Box>
      <BudgerBidding/>
    </Box>
  );
}
