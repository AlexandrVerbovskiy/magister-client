import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import env from "../../../env";
import CredentialsProvider from "next-auth/providers/credentials";
import { authByProvider } from "../../../services";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        authToken: { label: "Auth Token", type: "text" },
      },
      async authorize(credentials, req) {
        console.log(credentials);

        const user = {
          authToken: credentials.authToken,
        };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      console.log("user: ", user);
      console.log("profile: ", profile);
      console.log("account: ", account);

      /*if(account.provider.toLowerCase() == "google"){
        const res = await authByProvider({
          name:user.name,
          email:user.email,
          token:account.id_token,
          provider: "google"
        })

        user.authToken = "1234234";
      }

      if(account.provider.toLowerCase() == "facebook"){
        const res = await authByProvider({
          name:user.name,
          email:user.email,
          token:account.access_token,
          provider: "facebook"
        })

        user.authToken = "1234234";
      }*/

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.authToken = user.authToken;
      }

      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.authToken = token.authToken;
      }

      return session;
    },
  },
  secret: process.env.SECRET,
});
