// File: app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, Session, DefaultSession, DefaultUser } from "next-auth"; // Added DefaultSession, DefaultUser
import GoogleProvider from "next-auth/providers/google"; // Add this import
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("No user found with this email or password not set.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Ensure these fields are explicitly returned and match the User type extension
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  callbacks: {

    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser && existingUser.id !== user.id) {
          return '/auth/sign-in?error=AccountAlreadyExists';
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // console.log("JWT callback: Initial token, user, trigger, session:", { token, user, trigger, session });

      if (user) {
        // user object is only available on initial sign in (or when adapter creates token)
        token.id = user.id;
        token.role = user.role; // Cast user to 'any' if role is not directly on DefaultUser type
      } else if (token.sub) {
        // If 'user' is undefined (subsequent requests), use token.sub as the ID
        // token.sub is the unique identifier for the user from the provider
        token.id = token.sub;
      }

      // If session update triggered (e.g., signOut), update token role
      if (trigger === 'update' && session?.user?.role) {
        token.role = session.user.role;
      }
      // console.log("JWT callback: After update, token:", token);
      return token;
    },
    async session({ session, token }): Promise<Session> {
      // console.log("Session callback: Initial session and token:", { session, token });
      // Assign properties from the token to the session.user object
      if (token.id) {
        session.user.id = token.id;
      }
      if (token.role) {
        session.user.role = token.role;
      }
      // console.log("Session callback: After update, session:", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };