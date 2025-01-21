/* eslint-disable -- Disabling all Eslint rules for the file*/
"use client"
import { paths } from '@/paths';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import * as React from 'react';

import ExportForm from '@/components/dashboard/create-campaign/export-form';
import RedirectBtn from '@/components/dashboard/layout/redirect-btn';
import { CampaignCard } from '@/components/dashboard/overview/campaign-card';
import { campaignClient } from '@/lib/campaign-client';
import { useState } from 'react';
import { Campaign } from '@/types/campaign';
import { CircularProgress } from '@mui/material';



export default function Page(): React.JSX.Element {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [count, setCount] = React.useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = React.useState(1);

  const handlPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    fetchCampaigns(value);
  };

  async function fetchCampaigns(pageNo:number) {
    setLoading(true)
    try {
      const {count,data} = await campaignClient.getCampaigns(pageNo);
      setCount(Math.ceil(count/10));
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
    fetchCampaigns(1);
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
      {loading ? 
          <Box  
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CircularProgress />
          </Box>
        :
        <Grid container spacing={3}>
          {loading ?<Typography>Loading...</Typography>:
          campaigns?.length > 0 ?campaigns.map((campaign) => (
            <Grid key={campaign.id} lg={4} md={6} xs={12}>
              <CampaignCard campaign={campaign} />
            </Grid>
          )): <Typography>No campaigns available.</Typography> }
        </Grid>
        }
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination onChange={handlPageChange}  page={page} count={count} color="primary" />
        </Box>
      
    </Stack>
  );
}

