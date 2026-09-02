import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prismaAuth } from "./prisma-auth";

const APP_NAME = "gestion-location";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prismaAuth.user.findUnique({
          where: { email: String(credentials.email).toLowerCase() },
        });
        if (!user || !user.isActive || !user.password) return null;

        const valid = await bcrypt.compare(
          String(credentials.password),
          user.password
        );
        if (!valid) return null;

        const perm = await prismaAuth.appPermission.findUnique({
          where: { userId_app: { userId: user.id, app: APP_NAME } },
        });
        if (!perm) return null;

        return { id: user.id, email: user.email, name: user.name, role: perm.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  // Définir NEXTAUTH_COOKIE_DOMAIN=.mondomaine.home pour activer le SSO cross-app
  ...(process.env.NEXTAUTH_COOKIE_DOMAIN
    ? {
        cookies: {
          sessionToken: {
            options: {
              domain: process.env.NEXTAUTH_COOKIE_DOMAIN,
              path: "/",
              sameSite: "lax" as const,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            },
          },
        },
      }
    : {}),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      if (token?.role) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
