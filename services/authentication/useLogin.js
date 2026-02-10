import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../apiAuth';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();
  const {
    mutate: login,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      console.log(user);
      router.replace('/');
    },
    onError: (err) => {
      console.log('Error', err);
    },
  });
  return { login, isLoading, isError, error };
}
