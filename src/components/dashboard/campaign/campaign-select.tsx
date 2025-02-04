import { Box, Typography } from '@mui/material';
import { Image, Video } from '@phosphor-icons/react';

export const CampaignTypeSelector = ({ campaignType, setCampaignType, setValue }: any) => {
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
            backgroundColor: campaignType === 'Banner' ? 'primary.main' : 'transparent',
            color: campaignType === 'Banner' ? 'white' : 'text.primary', 
            '&:hover': {
            backgroundColor: campaignType === 'Banner' ? 'primary.dark' : 'grey.100', 
            },
            justifyContent: 'center',alignSelf: 'center'
        }}
        onClick={() => {
          setCampaignType('Banner');
          setValue && setValue('objective', 'Banner');
          setValue && setValue("buy_type",null);
          }}
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
            backgroundColor: campaignType === 'Video' ? 'primary.main' : 'transparent', 
            color: campaignType === 'Video' ? 'white' : 'text.primary', 
            '&:hover': {
            backgroundColor: campaignType === 'Video' ? 'primary.dark' : 'grey.100',
            },
            justifyContent: 'center',alignSelf: 'center'
        }}
        onClick={() => {
          setCampaignType('Video');
          setValue && setValue('objective', 'Video');
          setValue && setValue("buy_type",null);
        }}
        >
        <Video size={32} />
        <Typography variant="h6">Video</Typography> {/* Text */}
        </Box>
    </Box>
  );
};





