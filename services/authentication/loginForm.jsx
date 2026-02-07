'use client';
import { login } from '@/services/apiAuth';
import { useState } from 'react';
import { useLogin } from './useLogin';

export default function LoginForm() {
  const [email, setEmail] = useState('difede462@gmail.com');
  const [password, setPassword] = useState('password');

  const { login, isLoading } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  }
  return (
    <form className="loginForm" action="" onSubmit={handleSubmit}>
      <div className="loginForm__heading-container">
        <div className="loginForm__heading">Log in</div>
      </div>
      <div className="loginForm__user-container">
        <label className="loginForm__label" htmlFor="userName">
          Username
        </label>
        <input
          className="loginForm__input"
          id="userName"
          type="text"
          autoComplete="userName"
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
          type="text"
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button className="loginForm__button">Login</button>
    </form>
  );
}
