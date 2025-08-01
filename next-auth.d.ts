// File: next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: string;
      name: string;
      email: string;
      image: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    name: string;
    email: string;
    image: string | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * The contents of JWT can be customized with the `session` and `jwt` callbacks
   */
  interface JWT {
    id: string;
    role: string;
  }
}