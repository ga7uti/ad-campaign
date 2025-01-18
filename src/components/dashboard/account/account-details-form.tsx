/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { accountClient } from '@/lib/account-client';
import { User } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';


const schema = zod.object({
  first_name: zod.string().min(5, { message: 'First name must be at least 5 characters long' }),
  last_name: zod.string().min(5, { message: 'Last name must be at least 5 characters long' }),
  phone_no: zod.string().regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' }),
  email: zod.string().email({ message: 'Email is required' })
});

type Values = zod.infer<typeof schema>;

export function AccountDetailsForm(): React.JSX.Element {

  const [user, setUser] = React.useState<User | null>(null);
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isProfileUpdated,setIsProfileUpdated] = React.useState<boolean>(false);
  
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<Values>({ defaultValues: user || {}, resolver: zodResolver(schema) });

  async function fetchUser() {
    try {
      const response = await accountClient.getUser();
      setUser(response);
      reset(response);  
    } catch (error:any) {
      setError('root', { type: 'server', message: error.message});
     }
  }  
  
  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      try {
        await accountClient.updateUser(values);
        setIsProfileUpdated(true)
        setIsPending(false);
        fetchUser();
      } catch (error:any) {
        setError('root', { type: 'server', message: error.message});
      }finally{
        setIsPending(false);
      }
    },
    [setError]
  );

  React.useEffect(() => {
    fetchUser();
  }, []);
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="first_name"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.first_name)}>
                    <OutlinedInput {...field} defaultValue={user?.first_name} type="text" />
                    {errors.first_name ? <FormHelperText>{errors.first_name.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                  control={control}
                  name="last_name"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.last_name)}>
                      <OutlinedInput {...field} defaultValue={user?.last_name} type="text" />
                      {errors.last_name ? <FormHelperText>{errors.last_name.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.email)}>
                    <OutlinedInput disabled {...field} defaultValue={user?.email} type="email" />
                    {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="phone_no"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.phone_no)}>
                    <OutlinedInput {...field} defaultValue={user?.phone_no} type="number" />
                    {errors.phone_no ? <FormHelperText>{errors.phone_no.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
        {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}  
        <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? 'Saving...' : 'Save'}
          </Button>        
        </CardActions>
        {isProfileUpdated ? <Alert color="success">Profile updated successfully</Alert> : null} 
      </Card>
    </form>
  );
}