'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';
import * as React from 'react';

import { ExportFormPopover } from '@/components/dashboard/layout/export-form';
import type { Integration } from '@/components/dashboard/overview/campaign-card';
import { CampaignCard } from '@/components/dashboard/overview/campaign-card';
import { usePopover } from '@/hooks/use-popover';
import { paths } from '@/paths';
import RouterLink from 'next/link';



// export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

const integrations = [
  {
    id: 'INTEG-006',
    title: 'Dropbox',
    description: 'Dropbox is a file hosting service that offers cloud storage, file synchronization, a personal cloud.',
    logo: '/assets/logo-dropbox.png',
    installs: 594,
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
  },
  {
    id: 'INTEG-005',
    title: 'Medium Corporation',
    description: 'Medium is an online publishing platform developed by Evan Williams, and launched in August 2012.',
    logo: '/assets/logo-medium.png',
    installs: 625,
    updatedAt: dayjs().subtract(43, 'minute').subtract(1, 'hour').toDate(),
  },
  {
    id: 'INTEG-004',
    title: 'Slack',
    description: 'Slack is a cloud-based set of team collaboration tools and services, founded by Stewart Butterfield.',
    logo: '/assets/logo-slack.png',
    installs: 857,
    updatedAt: dayjs().subtract(50, 'minute').subtract(3, 'hour').toDate(),
  },
  {
    id: 'INTEG-003',
    title: 'Lyft',
    description: 'Lyft is an on-demand transportation company based in San Francisco, California.',
    logo: '/assets/logo-lyft.png',
    installs: 406,
    updatedAt: dayjs().subtract(7, 'minute').subtract(4, 'hour').subtract(1, 'day').toDate(),
  },
  {
    id: 'INTEG-002',
    title: 'GitHub',
    description: 'GitHub is a web-based hosting service for version control of code using Git.',
    logo: '/assets/logo-github.png',
    installs: 835,
    updatedAt: dayjs().subtract(31, 'minute').subtract(4, 'hour').subtract(5, 'day').toDate(),
  },
  {
    id: 'INTEG-001',
    title: 'Squarespace',
    description: 'Squarespace provides software as a service for website building and hosting. Headquartered in NYC.',
    logo: '/assets/logo-squarespace.png',
    installs: 435,
    updatedAt: dayjs().subtract(25, 'minute').subtract(6, 'hour').subtract(6, 'day').toDate(),
  },
] satisfies Integration[];

export default function Page(): React.JSX.Element {
  const exportPopOver = usePopover<HTMLDivElement>();

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Integrations</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button  onClick={exportPopOver.handleOpen} color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(5px)',
                zIndex: exportPopOver.open ? 1 : -1,
                opacity: exportPopOver.open ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
            <ExportFormPopover anchorEl={exportPopOver.anchorRef.current} onClose={exportPopOver.handleClose} open={exportPopOver.open} />
          </Stack>
        </Stack>
        <div>
          <Button component={RouterLink} href={paths.dashboard.createCampaign} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <Grid container spacing={3}>
        {integrations.map((integration) => (
          <Grid key={integration.id} lg={4} md={6} xs={12}>
            <CampaignCard integration={integration} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={3} size="small" />
      </Box>
    </Stack>
  );
}
