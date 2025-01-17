import { Campaign } from '@/types/campaign';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import dayjs from 'dayjs';
import * as React from 'react';

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
                <Avatar src={campaign.images?campaign.images[0]?.image:''} variant="square" sx={{ width: '100%', height: '100%' }} />
              </Box>
            </Grid>
            <Grid item xs>
              <Typography variant="h5">{campaign.name}</Typography>
              <Typography variant="body2">Language: {campaign.language.join(', ')}</Typography> 
              <Typography variant="body2">Device: {campaign.device.join(', ')}</Typography> 
              <Typography variant="body2">Exchange: {campaign.exchange.join(', ')}</Typography> 
              <Typography variant="body2">Environment: {campaign.environment.join(', ')}</Typography> 
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
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
