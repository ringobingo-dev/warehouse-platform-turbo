import { WorkOS } from "@workos-inc/node"

// Initialize WorkOS client
const workos = new WorkOS(process.env.WORKOS_API_KEY)

export const auth = {
  /**
   * Get the WorkOS SSO authorization URL
   */
  getAuthorizationUrl(redirectUri: string, organization?: string) {
    return workos.sso.getAuthorizationURL({
      clientID: process.env.WORKOS_CLIENT_ID || "",
      redirectURI: redirectUri,
      organization,
    })
  },

  /**
   * Exchange an authorization code for a profile and access token
   */
  async exchangeCode(code: string) {
    const { profile, accessToken } = await workos.sso.getProfileAndToken({
      code,
      clientID: process.env.WORKOS_CLIENT_ID || "",
    })

    return { profile, accessToken }
  },

  /**
   * Get organizations for the current user
   */
  async getOrganizations(domain?: string) {
    const organizations = await workos.organizations.listOrganizations({
      domains: domain ? [domain] : undefined,
    })

    return organizations
  },
}

