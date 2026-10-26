import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import CredentialsProvider from "next-auth/providers/credentials";

export const GUEST_EMAIL = "guest@local";

export const authOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        guest: { label: "Guest", type: "text" }
      },
      async authorize(credentials) {
        // Guest: no MongoDB — session only; todos live in localStorage
        if (credentials?.guest === "true") {
          return {
            id: "guest",
            email: GUEST_EMAIL,
            name: "Guest",
            isGuest: true
          };
        }

        const { email, password } = credentials || {};
        if (!email || !password) {
          throw new Error("Please enter valid data");
        }

        try {
          await connectDB();
        } catch (err) {
          throw new Error("Error connecting to database");
        }

        const user = await User.findOne({ email });
        if (!user) throw new Error("User does not exist");

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) throw new Error("Email or Password is incorrect");

        return {
          email: user.email,
          name: user.name || undefined,
          isGuest: false
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.isGuest = Boolean(user.isGuest);
        if (user.name) token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.isGuest =
          Boolean(token.isGuest) || token.email === GUEST_EMAIL;
        if (token.name) session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET
};
