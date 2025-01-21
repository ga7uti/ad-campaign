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
import CampaignInfo from './campaign-info';

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
        <Box sx={{ height: '200px' }}>
          <Avatar src={campaign.images?campaign.images[0]?.image:''} variant="square" sx={{ width: '100%', height: '100%' }} />
        </Box>
        <Box>
          <Typography sx={{marginBottom:'1rem'}} variant="h5">{campaign.name}</Typography>
          {campaign.location?<CampaignInfo name='Location' value={campaign.location.map(location => location.city)}/>:null}
          {campaign.device?<CampaignInfo name='Device'  value={campaign.device}/>:null}
          {campaign.exchange?<CampaignInfo name='Exchange'  value={campaign.exchange}/>:null}
          {campaign.environment?<CampaignInfo name='Environment'  value={campaign.environment}/>:null}
          {campaign.language?<CampaignInfo name='Language'  value={campaign.language}/>:null}
          {campaign.carrier?<CampaignInfo name='Carrier'  value={campaign.carrier}/>:null}
          {campaign.interset?<CampaignInfo name='Interest' value={campaign.interset?.map(data=>data.category)}/>:null}
        </Box>
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
