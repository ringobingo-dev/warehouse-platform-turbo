import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SSOProvider } from '../../utils/auth';

interface LoginButtonProps {
  provider: SSOProvider;
  redirectUri: string;
  className?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  provider,
  redirectUri,
  className = '',
}) => {
  const { loginWithSSO, isLoading } = useAuth();

  const handleLogin = () => {
    loginWithSSO(provider, redirectUri);
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 ${className}`}
    >
      {isLoading ? 'Loading...' : `Login with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
    </button>
  );
}; 