/* eslint-disable -- Disabling all Eslint rules for the file*/
"use client"
import { paths } from '@/paths';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import * as React from 'react';

import { CampaignTable } from '@/components/dashboard/campaign/campaign-table';
import ExportForm from '@/components/dashboard/campaign/export-form';
import RedirectBtn from '@/components/dashboard/layout/redirect-btn';
import { campaignClient } from '@/lib/campaign-client';
import { Campaign } from '@/types/campaign';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { Search } from '@/components/dashboard/layout/search';



export default function Page(): React.JSX.Element {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [count, setCount] = React.useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = React.useState(1);

  const handlPageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage+1)
    fetchCampaigns(newPage+1);
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
  };


  async function fetchCampaigns(pageNo:number) {
    setLoading(true)
    try {
      const {count,data} = await campaignClient.getCampaigns(pageNo);
      setCount(count);
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
      <Search placeholder={"Search campaigns by user"} onSearch={onSearchChange} />
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
        <CampaignTable count={count} rows={campaigns} page={page} handlePageChange={handlPageChange}/>
        }
    </Stack>
  );
}

