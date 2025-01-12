'use client';

import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { authClient } from '../../lib/auth/client';
import { paths } from '@/paths';

const schema = zod.object({
  firstName: zod.string().min(5, { message: 'First name must be at least 5 characters long' }),
  lastName: zod.string().min(5, { message: 'Last name must be at least 5 characters long' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must include at least one uppercase letter, one number, and one special character'
    ),
  terms: zod.boolean().refine((value) => value, 'You must accept the terms and conditions'),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { firstName: '', lastName: '', email: '', password: '', terms: false } satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useAuth();

    const [isPending, setIsPending] = React.useState<boolean>(false);

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
        // Call the signUp method from AuthClient
        const result = await authClient.signUp({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        });

        if (result.error) {
          setError('root', { type: 'server', message: result.error });
        } else {
          setError('root', { type: 'server', message: 'Registration successful!' });
          // Refresh the auth state and redirect if needed
          await checkSession?.();
          router.push(paths.auth.signIn); // Redirect to dashboard or any other page
        }
      } catch (error: unknown) {
        // Handle error cases
        setError('root', {
          type: 'server',
          message: 'An unexpected error occurred. Please try again later.',
        });
      } finally {
        setIsPending(false);
      }
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} href="/auth/sign-in" underline="hover" variant="subtitle2">
            Sign in
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.firstName)}>
                <InputLabel>First name</InputLabel>
                <OutlinedInput {...field} label="First name" />
                {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.lastName)}>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput {...field} label="Last name" />
                {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
                <div>
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label={
                      <React.Fragment>
                        I have read the <Link>terms and conditions</Link>
                      </React.Fragment>
                    }
                  />
                  {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
                </div>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? 'Signing up...' : 'Sign up'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}