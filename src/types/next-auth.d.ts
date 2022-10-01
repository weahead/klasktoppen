import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    permissions?: string[]
    user?: {
      id: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    // This comes from auth0
    permissions?: string[]
  }
}

declare module 'jose' {
  interface JWTPayload {
    // This comes from auth0
    permissions?: string[]
  }
}
