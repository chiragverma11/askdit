import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    image: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    picture: string | null;
  }
}
