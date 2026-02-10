'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignup } from './useSignup';

export default function CreateUserForm() {
  const [email, setEmail] = useState('difede462@gmail.com');
  const [password, setPassword] = useState('password');
  const router = useRouter();

  const [isSuccess, setIsSuccess] = useState(false);
  const { signup, isLoading, isError, error } = useSignup();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password || isLoading) return;
    setIsSuccess(false);
    signup(
      { email, password },
      {
        onSettled: () => {
          setEmail('');
          setPassword('');
        },
        onSuccess: (data) => {
          // If Supabase returns a session, the user is logged in automatically
          if (data?.session) {
            router.replace('/');
          } else {
            // Otherwise, they need to confirm their email
            setIsSuccess(true);
          }
        },
      }
    );
  }

  return (
    <form className="loginForm" onSubmit={handleSubmit}>
      <div className="loginForm__heading-container">
        <div className="loginForm__heading">Create user</div>
      </div>
      <div className="loginForm__user-container">
        <label className="loginForm__label" htmlFor="email">
          Email address
        </label>
        <input
          className="loginForm__input"
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="loginForm__password-container">
        <label className="loginForm__label" htmlFor="password">
          Password
        </label>
        <input
          className="loginForm__input"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button className="loginForm__button" disabled={isLoading}>
        Create
      </button>
      {isError && <span style={{ color: 'red' }}>{error.message}</span>}
      {isSuccess && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#e6fffa',
            border: '1px solid #38b2ac',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          <h4 style={{ color: '#2c7a7b', marginBottom: '0.5rem' }}>Account Created!</h4>
          <p style={{ color: '#285e61' }}>
            Please check your email (and spam) to confirm your account.
          </p>
        </div>
      )}
    </form>
  );
}
