import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const NextAuthConfig = {
    provider: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                const { email, password } = credentials;
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
        })
    ]
}

export default NextAuth(NextAuthConfig)