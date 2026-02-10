import { useMutation } from '@tanstack/react-query';
import { signup as signupApi } from '../apiAuth';
import { useRouter } from 'next/navigation';

export function useSignup() {
  const {
    mutate: signup,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: signupApi,
    onError: (err) => {
      console.log('Error during signup:', err);
    },
  });

  return { signup, isLoading: isPending, isError, error };
}
