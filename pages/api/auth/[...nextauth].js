import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import axios from "axios";


const NextAuthConfig = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials) {
                const { email, password } = credentials;
                if (!email || !password) {
                    throw new Error("Please enter valid data");
                }

                try {
                    await connectDB();
                } catch (err) {
                    throw new Error("Error connecting to database")
                }
                const user = await User.findOne({ email: email });
                if (!user) throw new Error("User does not exist");

                const isValid = await verifyPassword(password, user.password);
                if (!isValid) throw new Error("Email or Password is incorrect");

                return { email }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callback: {
        async signIn({ account, user }) {
            try {
                await connectDB();

                const existUser = await User.findOne({ email: user.email });

                if (!existUser) {
                    const newUser = await User.create({ email: user.email, password: "" });
                }
            } catch (err) {
                console.error("Error during sign-in:", err);

                return { success: false, message: "Sign-in failed" };
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            return session;
        },

    },


    secret: process.env.JWT_SECRET,
    adapter: MongoDBAdapter(clientPromise),
}

export default NextAuth(NextAuthConfig)