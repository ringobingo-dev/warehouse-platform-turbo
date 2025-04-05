import { WorkOS } from '@workos-inc/node';

// Initialize WorkOS client
export const workos = new WorkOS(process.env.WORKOS_API_KEY);

// SSO Provider types
export type SSOProvider = 'google' | 'microsoft' | 'saml';

// Generate SSO URL
export const generateSSOUrl = async (
  provider: SSOProvider,
  redirectUri: string,
  organizationId?: string
) => {
  return workos.sso.getAuthorizationURL({
    provider,
    redirectUri,
    organizationId,
  });
};

// Handle SSO callback
export const handleSSOCallback = async (code: string) => {
  const { profile } = await workos.sso.getProfileAndToken({
    code,
  });

  return {
    id: profile.id,
    email: profile.email,
    name: profile.firstName ? `${profile.firstName} ${profile.lastName}` : profile.email,
    organizationId: profile.organizationId,
  };
};

// Check MFA status
export const checkMFAStatus = async (userId: string) => {
  try {
    const response = await workos.mfa.getFactor(userId);
    return response.status === 'verified';
  } catch (error) {
    return false;
  }
}; 