/* eslint-disable -- Disabling all Eslint rules for the file*/
'use client';

import { useAuth } from '@/hooks/use-auth';
import { authClient } from '@/lib/auth-client';
import { paths } from '@/paths';
import { SignInParams } from '@/types/auth';
import { signInSchema } from '@/types/form-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import FormField from '../dashboard/layout/form-field';



export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { checkSession } = useAuth();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<SignInParams>({ resolver: zodResolver(signInSchema) });

  const onSubmit = React.useCallback(
    async (values: SignInParams): Promise<void> => {
      try{
        setIsPending(true);
        const response = await authClient.signIn(values);
        if (response) {
          await checkSession?.();
          router.refresh();
        }
      } catch (error:any) {
        setError('root', { type: 'server', message: error.message});
      } finally {
        setIsPending(false);
      }
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* UserName */}
          <Grid item xs={12} md={6} mb={1}>
            <Box sx={{ minWidth: 120 }}>
              <FormField
                  type="text"
                  placeholder="Username"
                  name="username"
                  register={register}
                  error={errors.username}
              />
            </Box>
          </Grid>

          {/* Password */}
          <Grid item xs={12} md={6} mb={1}>
            <Box sx={{ minWidth: 120 }}>
              <FormField
                  type="password"
                  placeholder="Password"
                  name="password"
                  register={register}
                  error={errors.password}
              />
            </Box>
          </Grid>
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              Forgot password?
            </Link>
          </div>
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
