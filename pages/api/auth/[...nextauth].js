import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";


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
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callback: {
        async session({ session }) {
            return session
        },
        async signIn({ profile }) {
            if (account.provider === "google") {
                try {
                    await connectDB();

                    const userExist = await User.findOne({ email: profile.email });

                    if (!userExist) {
                        const user = await User.create({
                            email: profile.email,
                            name: profile.name,
                        });
                    }
                } catch (err) {
                    return res.status(500).json({
                        status: "Failed",
                        message: "Error connecting to database"
                    })
                }
            }
        }
    },
    secret: process.env.JWT_SECRET,
    adapter: MongoDBAdapter(clientPromise),
}

export default NextAuth(NextAuthConfig)