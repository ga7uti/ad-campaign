import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import dayjs from 'dayjs';
import { Campaign } from '@/types/campaign';
import Grid from '@mui/material/Grid';

export interface Integration {
  id: string;
  title: string;
  description: string;
  logo: string;
  installs: number;
  updatedAt: Date;
}

export interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps): React.JSX.Element {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent sx={{ flex: '1 1 auto' }}>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item>
              <Box sx={{ width: 100, height: 100 }}>
                <Avatar src={campaign.images[0].image} variant="square" sx={{ width: '100%', height: '100%' }} />
              </Box>
            </Grid>
            <Grid item xs>
              <Typography variant="h5">{campaign.business_name}</Typography>
              <Typography variant="body2">Location: {campaign.geo_location}</Typography>
              <Typography variant="body2">Type: {campaign.campaign_type}</Typography>
              <Typography variant="body2">Language: {campaign.language}</Typography>
              <Typography variant="body2">Bidding: {campaign.bidding}</Typography>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
          <ClockIcon fontSize="var(--icon-fontSize-sm)" />
          <Typography color="text.secondary" display="inline" variant="body2">
           Budget: {campaign.budget}
          </Typography>
        </Stack>
        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
          <DownloadIcon fontSize="var(--icon-fontSize-sm)" />
          <Typography color="text.secondary" display="inline" variant="body2">
            Updated {dayjs(campaign.updated_at).format('MMM D, YYYY')}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
