/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { accountClient } from '@/lib/account-client';
import { profileSchema } from '@/types/form-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../layout/form-field';
import { User } from '@/types/auth';

export function AccountDetailsForm(): React.JSX.Element {

  const [user, setUser] = React.useState<User | null>(null);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const [isProfileUpdated,setIsProfileUpdated] = React.useState<boolean>(false);
  
  const {
    handleSubmit,
    setError,
    register,
    reset,
    formState: { errors },
  } = useForm<User>({resolver: zodResolver(profileSchema)});

  async function fetchUser() {
    setIsLoading(true);
    try {
      const response = await accountClient.getUser();
      setUser(response);
      reset(response);  
    } catch (error:any) {
      setError('root', { type: 'server', message: error.message});
    }finally{
      setIsLoading(false);
    }
  }  
  
  const onSubmit = React.useCallback(
    async (updateUser: User): Promise<void> => {
      setIsPending(true);
      try {
        await accountClient.updateUser(updateUser);
        setIsProfileUpdated(true)
        setIsPending(false);
      } catch (error:any) {
        setError('root', { type: 'server', message: error.message});
      }finally{
        setIsPending(false);
      }
    },
    [setError,fetchUser]
  );

  React.useEffect(() => {
    fetchUser();
  }, []);
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        {loading ? 
          <Box  
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '1rem',
              marginBottom:'1rem'
            }}>
            <CircularProgress />
          </Box>
        :
          <CardContent>
            <Grid container spacing={3}>
              {/* First Name */}
              <Grid item xs={12} md={6} mb={1}>
                  <Box sx={{ minWidth: 120 }}>
                  <FormField
                      type="text"
                      placeholder="First Name"
                      name="first_name"
                      register={register}
                      error={errors.first_name}
                  />
                  </Box>
                </Grid>

              {/* Last Name */}
              <Grid item xs={12} md={6} mb={1}>
                  <Box sx={{ minWidth: 120 }}>
                  <FormField
                      type="text"
                      placeholder="Last Name"
                      name="last_name"
                      register={register}
                      error={errors.last_name}
                  />
                  </Box>
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6} mb={1}>
                  <Box sx={{ minWidth: 120 }}>
                  <FormField
                      type="email"
                      placeholder="Email"
                      name="email"
                      register={register}
                      error={errors.email}
                      disabled={true}
                  />
                  </Box>
                </Grid>

                {/* Phone No */}
                <Grid item xs={12} md={6} mb={1}>
                  <Box sx={{ minWidth: 120 }}>
                  <FormField
                      type="text"
                      placeholder="Phone Number"
                      name="phone_no"
                      register={register}
                      error={errors.phone_no}
                  />
                  </Box>
                </Grid>
            </Grid>
          </CardContent>
          }
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
        {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}  
        {/* Submit Button */}
        {!isPending && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button variant="contained" color="primary" type="submit">
                Update Profile
              </Button>
            </Box>
          )}
          
          {isPending && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Box sx={{ marginLeft: 2 }}>
                  <CircularProgress />
                </Box>
              </Box>
          )}    
        </CardActions>
        {isProfileUpdated ? <Alert color="success">Profile updated successfully</Alert> : null} 
      </Card>
    </form>
  );
}