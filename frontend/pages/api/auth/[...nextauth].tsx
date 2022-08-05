import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import login from '../../../services/auth/login';

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, account, user }) {
      console.log(token);
      if (user && token) {
        token.dbAccessToken = user.accessToken;
        token.dbRefreshToken = user.refreshToken;

        if (Date.now() < token.exp) {
          return token;
        }
      }

      // Check if need a refresh token
      // Docs: https://next-auth.js.org/tutorials/refresh-token-rotation

      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.dbAccessToken = token.dbAccessToken;
        session.dbRefreshToken = token.dbRefreshToken;
      }

      return session;
    },
  },
  jwt: {
    maxAge: 900,
  },
  session: {
    maxAge: 900,
  },
  pages: {
    error: '/login',
    signIn: '/login',
    signOut: '/login',
  },
  secret: process.env.ACCESS_TOKEN,   // Needs to be the same as the secret in the backend
  providers: [
    CredentialsProvider({
      name: 'Custom Provider',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (credentials !== undefined) {
          const values = {
            email: credentials.email,
            password: credentials.password,
          };

          const response = await login(values);

          if (response !== null) {
            if (response.status !== 422) {
              var user = {
                id: response.data.user.id,
                name: response.data.user.username,
                email: response.data.user.email,
                accessToken: response.data.tokens.accessToken,
                refreshToken: response.data.tokens.refreshToken,
              };
              return user;
            } else {
              return null;
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
};
export default NextAuth(authOptions);



// Test code for refresh token

// async function refreshAccessToken(token) {
//   try {

//     const refreshedTokens = await response.json()

//     if (!response.ok) {
//       throw refreshedTokens
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token,
//       accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
//     }
//   } catch (error) {
//     console.log(error)

//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     }
//   }
// }
