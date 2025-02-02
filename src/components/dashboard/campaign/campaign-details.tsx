import { CampaignDetailsPopOverProps } from '@/types/props';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Copy, Download, X } from '@phosphor-icons/react';
import * as React from 'react';
 
  export function CampaignDetailsPopOver({onClose, open, data }: CampaignDetailsPopOverProps): React.JSX.Element {
  
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
    };

    const downloadFile = (fileUrl: string) => {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    };

    const getValueOrNA = (value: any): string => {
      return value !== undefined && value !== null && value !== "" && value !== 0 
        && value !== "0" && value !== 0.0 && value !== "0.00" ? value : "Not Available";
    };

    return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: '50%',
            height: '50%',
            maxWidth: 'none',
            padding: 2,
          },
        }}
      >
        {/* Header */}
      <DialogTitle sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3">
          {data?.name || 'Campaign Details'}
        </Typography>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
  
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Campaign Details */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              {/* Details */}
              <Box sx={{ flex: 1 }}>
                {data && (
                  <>
                    {Object.entries({
                        Objective: data.objective,
                        Status: data.status,
                      'Total Budget': `${data.total_budget}`,
                      'Unit Rate': `${data.unit_rate}`,
                      'Start Time': `${data.start_time}`,
                      'End Time': `${data.end_time}`,
                      Clicks: data.click,
                      CTR: `${data.ctr}`,
                      VTR: `${data.vtr}`,
                      Views: data.views,
                      'Pay Rate': data.pay_rate,
                    }).map(([label, value]) => (
                      <Box key={label} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 'bold', flex: 1 }}>{label}:</Typography>
                        <TextField
                          value={getValueOrNA(value)}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <IconButton
                                onClick={() => copyToClipboard(String(value))}
                                edge="end"
                              >
                                <Copy size={16} />
                              </IconButton>
                            ),
                          }}
                          sx={{ flex: 2 }}
                        />
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            </Box>
  
            <Divider />
  
            {/* Additional Campaign Data */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Additional Details
              </Typography>
              {data && (
                <>
                  {Object.entries({
                    Locations: data.location.map((loc) => loc.city).join(', '),
                    Languages: data.language.join(', '),
                    Devices: data.device.join(', '),
                    Environment: data.environment.join(', '),
                    Carrier: data.carrier.join(', '),
                    'Device Prices': data.device_price.join(', '),
                    Exchanges: data.exchange.join(', '),
                    'Interest Categories': data.target_type
                      .map((type) => type.category+" > "+ type.subcategory)
                      .join(', '),
                    'Landing Page': data.landing_page,
                  }).map(([label, value]) => (
                    <Box key={label} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 'bold', flex: 1 }}>{label}:</Typography>
                      <TextField
                        value={getValueOrNA(value)}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <IconButton
                              onClick={() => copyToClipboard(String(value))}
                              edge="end"
                            >
                              <Copy size={16} />
                            </IconButton>
                          ),
                        }}
                        sx={{ flex: 2 }}
                      />
                    </Box>
                  ))}
                </>
              )}
            </Box>
            <Divider/>
            {/* Attachments Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Attachments
              </Typography>
              {data && (
                <>
                  {/* Images */}
                  {data.images && data.images.length > 0 && (
                    <Box sx={{ marginBottom: 2 }}>
                      {data.images.map((image, index) => (
                        <Box
                          key={`image-${index}`}
                          sx={{
                            marginBottom: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Typography sx={{ flex: 1 }}>{`Image`}</Typography>
                          <Button
                            variant="outlined"
                            startIcon={<Download size={16} />}
                            onClick={() => downloadFile(image.image)}
                          >
                            Download
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Video */}
                  {data.video && data.video.length > 0 && (
                    <Box sx={{ marginBottom: 2 }}>
                      {data.video.map((video, index) => (
                        <Box
                          key={`video-${index}`}
                          sx={{
                            marginBottom: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Typography sx={{ flex: 1 }}>{`Video`}</Typography>
                          <Button
                            variant="outlined"
                            startIcon={<Download size={16} />}
                            onClick={() => downloadFile(video.video)}
                          >
                            Download
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {[
                  { label: 'Keywords', files: data.keywords },
                  { label: 'Tag&Tracker', files: data.tag_tracker },
                  ].map(({ label, files }) =>
                    files.map((file, index) => (
                      <Box
                        key={`${label}-${index}`}
                        sx={{
                          marginBottom: 2,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography sx={{ flex: 1 }}>{label}:</Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Download size={16} />}
                          onClick={() => downloadFile(file.file)}
                        >
                          Download
                        </Button>
                      </Box>
                    ))
                  )}
                </>
              )}
          </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
  