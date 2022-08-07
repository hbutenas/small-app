import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import login from '../../../services/auth/login';
import refresh from '../../../services/auth/refresh'

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      
      if (user && token) {
        token.dbAccessToken = user.accessToken;
        token.dbRefreshToken = user.refreshToken;
        token.name = user.name;
        token.accessTokenExpires = user.accessTokenExpires

      }

      if(token){

        // @ts-ignore
        if (Date.now() < token.accessTokenExpires) {
          return token;
        }
        else{
          var values = {
            token: token.dbRefreshToken
          }
          const response = await refresh(values);
          if(response !== null){
            token.dbAccessToken = response.data.accessToken;
            token.dbRefreshToken = response.data.refreshToken;
            token.accessTokenExpires = Date.now() + 900000  // 900000MS is 15 Mins
            console.log("REFRESHED")
            return token
          }
          else{
            return {
             ... token,
              error: "RefreshAccessTokenError"
            }
          }
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.dbAccessToken = token.dbAccessToken;
        session.dbRefreshToken = token.dbRefreshToken;
        session.name = token.name;
        session.accessTokenExpires = token.accessTokenExpires

      }

      return session;
    },
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
                name: response.data.user.name,
                email: response.data.user.email,
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                accessTokenExpires: Date.now() + 900000,      // 900000MS is 15 Mins

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
