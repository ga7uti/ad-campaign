"use client";

import { Box, Divider } from '@mui/material';
import React from 'react';

import BudgerBidding from '@/components/dashboard/create-campaign/BudgetBidding';
import CampaignSetting from '@/components/dashboard/create-campaign/CampaignSetting';
import { Container } from '@mui/system';

const drawerWidth = 240;

export default function CreateCampaignPage(): React.JSX.Element {
  return (
    <Container>
        <CampaignSetting/>
        <BudgerBidding/>
    </Container>
  );
}
