import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";  // import your Prisma client instance
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        // Find user by email
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        // Check hashed password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return user;
      }
    })
  ],
  pages: {
    signIn: "/login"  // you can create custom login page at /login
  },
  callbacks: {
    // Add user role to the token and session
    jwt: ({ token, user }) => {
      if (user) token.role = user.role;
      return token;
    },
    session: ({ session, token }) => {
      if (token && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
