"use client"
import { paths } from '@/paths';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import * as React from 'react';

import { CampaignTable } from '@/components/dashboard/campaign/campaign-table';
import { CampaignDetailsPopOver } from '@/components/dashboard/campaign/campaign-details';
import RedirectBtn from '@/components/dashboard/layout/redirect-btn';
import { Search } from '@/components/dashboard/layout/search';
import { usePopover } from '@/hooks/use-popover';
import { campaignClient } from '@/lib/campaign-client';
import { Campaign } from '@/types/campaign';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';



export default function Page(): React.JSX.Element {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [campaign, setCampaign] = React.useState<Campaign>();
  const [count, setCount] = React.useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = React.useState(1);
  const exportPopOver = usePopover<HTMLDivElement>();

  const handleCampaignClick = (id: number) => {
    const selectedCampaign = campaigns.find((campaign) => campaign.id === id);
    if (selectedCampaign) {
      setCampaign(selectedCampaign);
      exportPopOver.handleOpen();
    }
  };
  
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
        <CampaignTable count={count} rows={campaigns} page={page} handlePageChange={handlPageChange} onRowClick={handleCampaignClick}/>
        }
        <CampaignDetailsPopOver anchorEl={exportPopOver.anchorRef.current} onClose={exportPopOver.handleClose} open={exportPopOver.open}  data={campaign}/>
    </Stack>
  );
}

