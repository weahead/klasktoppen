import { createRemoteJWKSet, jwtVerify } from 'jose'
import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import { prisma } from '../../../server/db/client'
import { env } from '../../../env/server.mjs'

import type { NextAuthOptions } from 'next-auth'

const JWKS = createRemoteJWKSet(
  new URL(`${env.AUTH0_ISSUER}/.well-known/jwks.json`)
)

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (profile?.name) {
        token.name = profile.name
      }

      if (account?.access_token) {
        const { payload } = await jwtVerify(account?.access_token, JWKS, {
          issuer: `${env.AUTH0_ISSUER}/`,
          audience: env.AUTH0_AUDIENCE,
        })
        token.access_token = account.access_token
        token.permissions = payload.permissions
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        if (token?.sub) {
          session.user.id = token.sub
        }

        if (token?.name) {
          session.user.name = token.name
        }
      }

      if (token?.permissions) {
        session.permissions = token.permissions
      }

      return session
    },
    async signIn({ account, profile }) {
      if (account.provider === 'auth0' && profile && profile.email) {
        if (profile.email_verified && profile.email.endsWith('@weahead.se')) {
          return true
        }
      }
      return false
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      authorization: {
        params: {
          audience: env.AUTH0_AUDIENCE,
          scope: [
            'openid',
            'email',
            'profile',
            'read:users',
            'add:game',
            'edit:game',
            'delete:game',
          ].join(' '),
        },
      },
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER,
      profile(profile) {
        return {
          id: profile.sub,
          given_name: profile.given_name ?? '',
          family_name: profile.family_name ?? '',
          nickname: profile.nickname ?? '',
          name: profile.name ?? '',
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
