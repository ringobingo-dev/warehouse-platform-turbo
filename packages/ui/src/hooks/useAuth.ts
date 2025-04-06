import { useStore } from '../store/useStore';
import { generateSSOUrl, handleSSOCallback, checkMFAStatus } from '../utils/auth';
import { SSOProvider } from '../utils/auth';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    mfaEnabled,
    ssoEnabled,
    organizationId,
    setUser,
    setAuthenticated,
    setLoading,
    setError,
    setMfaEnabled,
    setSsoEnabled,
    setOrganizationId,
    logout,
  } = useStore();

  const loginWithSSO = async (provider: SSOProvider, redirectUri: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = await generateSSOUrl(provider, redirectUri, organizationId || undefined);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during SSO login');
    } finally {
      setLoading(false);
    }
  };

  const handleCallback = async (code: string) => {
    try {
      setLoading(true);
      setError(null);

      const userData = await handleSSOCallback(code);
      const mfaStatus = await checkMFAStatus(userData.id);

      setUser(userData);
      setAuthenticated(true);
      setMfaEnabled(mfaStatus);
      setSsoEnabled(true);
      setOrganizationId(userData.organizationId || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during authentication');
      logout();
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    mfaEnabled,
    ssoEnabled,
    organizationId,
    loginWithSSO,
    handleCallback,
    logout,
  };
}; 