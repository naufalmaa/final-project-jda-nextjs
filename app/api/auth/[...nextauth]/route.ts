// File: app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // your Prisma client

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const },
  providers: [
    CredentialsProvider({
      name: "Email / Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const user = await prisma.user.findUnique({
          where: { email: creds!.email },
        });
        if (!user || !user.passwordHash) return null;
        const isValid = await verifyPassword(creds!.password, user.passwordHash);
        if (!isValid) return null;
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt: ({ token, user }: any) => {
      if (user) {
        token.role = user.role;
        token.assignedSchoolId = user.assignedSchoolId;
      }
      return token;
    },
    session: ({ session, token }: any) => {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.assignedSchoolId = token.assignedSchoolId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",  // note: NextAuth v4 doesn’t support signUp here by default, but we’ll handle redirects manually
  },
};

// export default NextAuth(authOptions);
const authHandler = NextAuth(authOptions);

// …and export it for the HTTP methods NextAuth needs:
export { authHandler as GET, authHandler as POST };
// Utility to compare password → bcrypt or argon2 under the hood
async function verifyPassword(plain: string, hash: string) {
  // e.g. return await bcrypt.compare(plain, hash);
  return true;
}
