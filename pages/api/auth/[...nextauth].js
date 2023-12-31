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
        async signIn({ account, profile, user }) {
            if (account.provider === "google") {
                try {
                    await connectDB();

                    const userExist = await User.findOne({ email: profile.email });

                    if (!userExist) {
                        const newUser = await User.create({
                            email: profile.email,
                            name: profile.name,
                            // Add other fields as needed
                        });

                        // Optionally, you can update the user object returned by the callback
                        return { ...user, newUser };
                    }
                } catch (err) {
                    console.error(err);
                    // Handle the error appropriately, e.g., send a response to the client
                }
            }
        },
    },
    secret: process.env.JWT_SECRET,
    adapter: MongoDBAdapter(clientPromise),
}

export default NextAuth(NextAuthConfig)