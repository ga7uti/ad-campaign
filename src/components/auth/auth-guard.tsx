'use client';
import { useAuth } from '@/hooks/use-auth';
import { logger } from '@/lib/default-logger';
import { paths } from '@/paths';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { token, error, isLoading } = useAuth();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    // Check both hook token and localStorage
    if (!token) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
      router.replace(paths.auth.signIn);
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    // Add small delay to allow localStorage updates to complete
    const timeoutId = setTimeout(() => {
      checkPermissions().catch(() => {
        // noop
      });
    }, 100);

    return () => {clearTimeout(timeoutId)};
  }, [token, error, isLoading]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}