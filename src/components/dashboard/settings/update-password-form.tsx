'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormHelperText } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const schema = zod.object({
  old_password: zod
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must include at least one uppercase letter, one number, and one special character'
    ),
  new_password: zod
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must include at least one uppercase letter, one number, and one special character'
    ),
  confirm_password: zod
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must include at least one uppercase letter, one number, and one special character'
    ),
  }).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

type Values = zod.infer<typeof schema>;

const defaultValues = {confirm_password: '',old_password:'',new_password:''} satisfies Values;

export function UpdatePasswordForm(): React.JSX.Element {
 
   const [isPending, setIsPending] = React.useState<boolean>(false);
   const [showOldPassword, setShowOldPassword] = React.useState<boolean>(false);
   const [showNewPassword, setShowNewPassword] = React.useState<boolean>(false);
 
   const {
     control,
     handleSubmit,
     setError,
     formState: { errors },
   } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });
 
   const onSubmit = React.useCallback(
       async (values: Values): Promise<void> => {
         setIsPending(true);
         try {
           console.log('Values:', values);
         } catch (error: unknown) {
           setError('root', {
             type: 'server',
             message: 'An unexpected error occurred. Please try again later.',
           });
         } finally {
           setIsPending(false);
         }
       },
       [setError]
    );
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <Controller
              control={control}
              name="old_password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.old_password)}>
                  <InputLabel>Old Password</InputLabel>
                  <OutlinedInput
                  {...field}
                  endAdornment={
                    showOldPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowOldPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowOldPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showOldPassword ? 'text' : 'password'}
                />
                  {errors.old_password ? <FormHelperText>{errors.old_password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="new_password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.new_password)}>
                  <InputLabel>New Password</InputLabel>
                  <OutlinedInput
                  {...field}
                  endAdornment={
                    showNewPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowNewPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowNewPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showNewPassword ? 'text' : 'password'}
                />
                  {errors.new_password ? <FormHelperText>{errors.new_password.message}</FormHelperText> : null}
                </FormControl>
              )}
             />
             <Controller
              control={control}
              name="confirm_password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.confirm_password)}>
                  <InputLabel>Confirm Password</InputLabel>
                  <OutlinedInput {...field} label="Password" type="password" />
                  {errors.confirm_password ? <FormHelperText>{errors.confirm_password.message}</FormHelperText> : null}
                </FormControl>
              )}
             />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? 'Updating...' : 'Update'}
          </Button>        </CardActions>
      </Card>
    </form>
  );
}
