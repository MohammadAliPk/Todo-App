import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
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
          throw new Error("Error connecting to database");
        }
        const user = await User.findOne({ email });
        if (!user) throw new Error("User does not exist");

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) throw new Error("Email or Password is incorrect");

        return { email };
      }
    })
  ],
  secret: process.env.JWT_SECRET
};
