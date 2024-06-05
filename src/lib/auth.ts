import { env } from "@/env.mjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { customAlphabet } from "nanoid";
import { lowercase } from "nanoid-dictionary";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
  REDIS_CACHE_EXPIRATION_SECONDS,
  USER_CACHE_KEY_PREFIX,
} from "./config";
import { db } from "./db";
import { redis } from "./redis";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id;
        token.name = user.name;
        token.username = user.username;
        token.email = user.email;
        token.image = user.image;
        return token;
      }

      const cache = await redis.get(`${USER_CACHE_KEY_PREFIX}${token.id}`);

      if (!cache) {
        const dbUser = await db.user.findUnique({
          where: {
            id: token.id,
          },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
          },
        });

        if (!dbUser) {
          token.id = user.id;
          token.name = user.name;
          token.username = user.username;
          token.email = user.email;
          token.image = user.image;
          return token;
        }

        if (!dbUser.username) {
          const updatedUser = await db.user.update({
            where: {
              id: dbUser.id,
            },
            data: {
              username: `${dbUser.name?.split(" ")[0].toLowerCase()}_${customAlphabet(
                lowercase,
                5,
              )()}`,
            },
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              image: true,
            },
          });

          await redis.set(
            `${USER_CACHE_KEY_PREFIX}${updatedUser.id}`,
            JSON.stringify(updatedUser),
            "EX",
            REDIS_CACHE_EXPIRATION_SECONDS,
          );

          return {
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            picture: updatedUser.image,
          };
        }

        await redis.set(
          `${USER_CACHE_KEY_PREFIX}${dbUser.id}`,
          JSON.stringify(dbUser),
          "EX",
          REDIS_CACHE_EXPIRATION_SECONDS,
        );

        return {
          id: dbUser.id,
          name: dbUser.name,
          username: dbUser.username,
          email: dbUser.email,
          picture: dbUser.image,
        };
      }

      const cachedUser = JSON.parse(cache);

      return {
        id: cachedUser.id,
        name: cachedUser.name,
        username: cachedUser.username,
        email: cachedUser.email,
        picture: cachedUser.image,
      };
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
