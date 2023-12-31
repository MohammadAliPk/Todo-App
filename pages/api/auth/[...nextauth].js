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
        })
    ],
    callback: {
        async session({ session }) {
            const sessionUser = User.findOne({ email: session.user.email });
            session.user.id = sessionUser._id;
            return session;
        },
        async signIn({ account, profile, user }) {
            if (account.provider === "google") {
                try {
                    await connectDB();

                    const userExist = await User.findOne({ email: profile.email });

                    if (!userExist) {
                        const newUser = await User.findOneAndUpdate(
                            { email: profile.email },
                            {
                                $setOnInsert: {
                                    email: profile.email,
                                    name: profile.name,
                                },
                            },
                            { upsert: true, new: true }
                        );

                        if (!newUser) {
                            throw new Error("Failed to create a new user");
                        }

                        return { id: newUser._id };
                    }

                    return { id: userExist._id };
                } catch (err) {
                    console.error("Error connecting to database:", err);
                    throw new Error("Error connecting to database");
                }
            }
        },
    },
    secret: process.env.JWT_SECRET,
    adapter: MongoDBAdapter(clientPromise),
}

export default NextAuth(NextAuthConfig)