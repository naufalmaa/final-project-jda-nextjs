// File: app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, Session, DefaultSession, DefaultUser } from "next-auth"; // Added DefaultSession, DefaultUser
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";

// Extend the Session and JWT types for NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id to the user object in the session
      role: string; // Add role to the user object in the session
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string; // Ensure the User type (returned by authorize) has an ID
    role: string; // Ensure the User type has a role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add id to the JWT token
    role: string; // Add role to the JWT token
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
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

        // console.log("Authorize callback: User found and password valid.", {
        //   id: user.id,
        //   email: user.email,
        //   name: user.name,
        //   role: user.role,
        // });

        // Ensure these fields are explicitly returned and match the User type extension
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
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
    async session({ session, token }) {
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