'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useUser from '@/services/authentication/userUser';
import SpinnerMini from './spinnerMini';
import styled from 'styled-components';

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function ProtectedRoute({ children }) {
  // 1. Load the authenticated user
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  // 2. If there is NO authenticated user, redirect to the /login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) router.push('/login');
    },
    [isAuthenticated, isLoading, router]
  );

  // 3. While loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <SpinnerMini />
      </FullPage>
    );

  // 4. If there IS a user, render the app
  if (isAuthenticated) return children;

  return null;
}
