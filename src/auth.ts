import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true, // Fix for UntrustedHost error
  session: {
    strategy: "jwt", // Use JWT tokens stored in cookies instead of database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home page after sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/home`;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Initialize credits for new users
      if (isNewUser && user.id) {
        try {
          console.log(
            "🆕 New user detected! Initializing credits for:",
            user.email
          );
          const { creditsService } = await import("@/lib/credits-service");

          // Check if credits were already initialized to prevent duplicate initialization
          const { prisma } = await import("@/lib/prisma");
          const existingTransactions = await prisma.creditTransaction.findFirst(
            {
              where: {
                userId: user.id,
                type: "SIGNUP_BONUS",
              },
            }
          );

          if (existingTransactions) {
            console.log("⚠️ Credits already initialized for user:", user.email);
            return;
          }

          await creditsService.initializeNewUserCredits(user.id);
          console.log(
            "✅ Successfully initialized 50 credits for:",
            user.email
          );
        } catch (error) {
          console.error("Failed to initialize credits for new user:", error);
        }
      }
    },
    async signOut() {},
  },
  debug: process.env.NODE_ENV === "development",
});
