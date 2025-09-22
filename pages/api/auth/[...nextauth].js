import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { innerAuthByProvider } from "../../../services";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "User Id", type: "text" },
        authToken: { label: "Auth Token", type: "text" },
        needRegularViewInfoForm: {
          label: "Need Regular View Info Form",
          type: "bool",
        },
      },
      async authorize(credentials, req) {
        const user = {
          userId: credentials.userId,
          authToken: credentials.authToken,
          needRegularViewInfoForm: credentials.needRegularViewInfoForm,
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

          const res = await innerAuthByProvider(dataToSend);

          user.userId = res.userId;
          user.authToken = res.authToken;
          user.needRegularViewInfoForm = res.needRegularViewInfoForm;
        } catch (e) {
          return "/?error=" + encodeURI(e.message);
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.authToken = user.authToken;
      }

      return token;
    },
    session({ session, token }) {
      if (token && session?.user) {
        session.user.authToken = token.authToken;
      }

      return session;
    },
  },
  secret: process.env.SECRET,
  session: {
    maxAge: 60 * 60 * 24 * 90,
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
    newUser: "/",
  },
});
