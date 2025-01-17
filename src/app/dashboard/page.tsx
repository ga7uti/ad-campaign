/* eslint-disable -- Disabling all Eslint rules for the file*/
"use client"
import { paths } from '@/paths';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import * as React from 'react';

import ExportForm from '@/components/dashboard/create-campaign/ExportForm';
import RedirectBtn from '@/components/dashboard/layout/redirect-btn';
import { CampaignCard } from '@/components/dashboard/overview/campaign-card';
import { campaignClient } from '@/lib/campaign-client';
import { useState } from 'react';
import { Campaign } from '@/types/campaign';



export default function Page(): React.JSX.Element {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  
  async function fetchCampaigns() {
    try {
      const data = await campaignClient.getCampaigns();
      if (Array.isArray(data)) {
        setCampaigns(data);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchCampaigns();
  }, []);


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Campaigns</Typography>
          <ExportForm/>
        </Stack>
        <div>
          <RedirectBtn url={paths.dashboard.createCampaign} redirect={true}/>
        </div>
      </Stack>
      <Grid container spacing={3}>
        {loading ?<Typography>Loading...</Typography>:
        campaigns?.length > 0 ?campaigns.map((campaign) => (
          <Grid key={campaign.id} lg={4} md={6} xs={12}>
            <CampaignCard campaign={campaign} />
          </Grid>
        )): <Typography>No campaigns available.</Typography> }
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={campaigns.length} size="small" />
      </Box>
    </Stack>
  );
}

