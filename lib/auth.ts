import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import UserModel from "@/Models/User";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your credentials");
        }
        try {
          await connectToDatabase();
          const user = await UserModel.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("User not found with this email");
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Invalid password");
          }
          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    //
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages : {
    signIn: "/login",
    error: "/login",
  },
  session: {
    // By default sessions work with database and there is no need of jwt callback, but when our sessions strategy is jwt we need jwt callback.
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret : process.env.NEXTAUTH_SECRET
};
