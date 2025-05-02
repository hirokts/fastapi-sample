'use client'

import { Auth0Provider as AuthProvider } from '@auth0/auth0-react'
import type React from 'react'

export const ProviderAuth0 = ({ children }: { children: React.ReactNode }) => {
  const auth0_domain = process.env['NEXT_PUBLIC_AUTH0_DOMAIN'] || ''
  const auth0_client = process.env['NEXT_PUBLIC_AUTH0_CLIENT_ID'] || ''
  const auth0_audience = process.env['NEXT_PUBLIC_AUTH0_AUDIENCE'] || ''
  const redirectUri = process.env['NEXT_PUBLIC_BASE_URL'] || ''

  return (
    <AuthProvider
      domain={auth0_domain}
      clientId={auth0_client}
      authorizationParams={{
        audience: auth0_audience,
        redirect_uri: redirectUri,
      }}
      useRefreshTokens={true}
      cacheLocation={'localstorage'}
    >
      {children}
    </AuthProvider>
  )
}
