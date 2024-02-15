import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import env from "../../../env";
import CredentialsProvider from "next-auth/providers/credentials";
import { authByProvider } from "../../../services";
import { signOut } from "next-auth/react";

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
      let redirectUrl = "/";

      if (
        account.provider.toLowerCase() == "facebook" ||
        account.provider.toLowerCase() == "google"
      ) {
        try {
          const dataToSend = {
            name: user.name,
            email: user.email,
            provider: account.provider,
          };

          if (account.provider.toLowerCase() == "facebook") {
            dataToSend["token"] = account.access_token;
          }

          if (account.provider.toLowerCase() == "google") {
            dataToSend["token"] = account.id_token;
          }

          const res = await authByProvider(dataToSend);
          user.authToken = res.authToken;
          if (res.needRegularViewInfoForm)
            redirectUrl = "/settings/profile-edit";
        } catch (e) {
          signOut();
          return "/?error=" + encodeURI(e.message);
        }
      }

      return redirectUrl + "?success=" + encodeURI("Login successfully");
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
