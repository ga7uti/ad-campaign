import { Box, Typography } from '@mui/material';
import { Image, Video } from '@phosphor-icons/react';

export const CampaignTypeSelector = ({ campaignType, setCampaignType }: any) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 , justifyContent: 'center',alignItems: 'center'}}>
        {/* Banner Button */}
        <Box
        sx={{
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            padding: 1,
            cursor: 'pointer',
            width: '240px',
            height: '120px',
            backgroundColor: campaignType === 'banner' ? 'primary.main' : 'transparent',
            color: campaignType === 'banner' ? 'white' : 'text.primary', 
            '&:hover': {
            backgroundColor: campaignType === 'banner' ? 'primary.dark' : 'grey.100', 
            },
            justifyContent: 'center',alignSelf: 'center'
        }}
        onClick={() => setCampaignType('banner')} // Click behavior
        >
        <Image size={32} /> {/* Icon */}
        <Typography variant="h6">Banner</Typography> {/* Text */}
        </Box>

        {/* Video Box */}
        <Box
        sx={{
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            padding: 1,
            cursor: 'pointer',
            width: '240px',
            height: '120px',
            backgroundColor: campaignType === 'video' ? 'primary.main' : 'transparent', 
            color: campaignType === 'video' ? 'white' : 'text.primary', 
            '&:hover': {
            backgroundColor: campaignType === 'video' ? 'primary.dark' : 'grey.100',
            },
            justifyContent: 'center',alignSelf: 'center'
        }}
        onClick={() => setCampaignType('video')} // Click behavior
        >
        <Video size={32} /> {/* Icon */}
        <Typography variant="h6">Video</Typography> {/* Text */}
        </Box>
    </Box>
  );
};





