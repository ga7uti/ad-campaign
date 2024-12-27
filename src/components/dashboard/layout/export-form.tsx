import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { Button, Card, CardContent, CardHeader, FormControl, InputLabel, Select, TextField } from '@mui/material';
import { ArrowFatUp } from '@phosphor-icons/react/dist/ssr/ArrowFatUp';
import { X } from '@phosphor-icons/react/dist/ssr';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

  
  export function ExportFormPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
    const { checkSession } = useUser();
  
    const router = useRouter();
  
    const handleSignOut = React.useCallback(async (): Promise<void> => {
      try {
        const { error } = await authClient.signOut();
  
        if (error) {
          logger.error('Sign out error', error);
          return;
        }
  
        // Refresh the auth state
        await checkSession?.();
  
        // UserProvider, for this case, will not refresh the router and we need to do it manually
        router.refresh();
        // After refresh, AuthGuard will handle the redirect
      } catch (err) {
        logger.error('Sign out error', err);
      }
    }, [checkSession, router]);
  
    return (
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
        onClose={onClose}
        open={open}
        slotProps={{ paper: { sx: { width: '540px' } } }}
      >
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card>
            <Button
              onClick={onClose}
              sx={{ position: 'absolute', top: 8, right: 8 }} startIcon={<X fontSize="var(--icon-fontSize-md)" />} 
            />
            <CardHeader title="Location Setting" />
            <CardContent>
              <Typography variant="body2">Select location for the campaign:</Typography>
              <FormControl fullWidth>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button color="inherit" startIcon={<ArrowFatUp fontSize="var(--icon-fontSize-md)" />} variant="contained">Export</Button>
                </div>
              </FormControl>
            </CardContent>
          </Card>
        </Box>
      </Popover>
    );
  }
  