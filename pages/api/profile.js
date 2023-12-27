import { getSession } from "next-auth/react";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";

async function handler(req, res) {


    // Connect to DB
    try {
        await connectDB();
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: "Error connecting to database"
        })
    }

    const session = await getSession({ req });

    if (!session) {
        return res.status(422).json({
            status: "Failed",
            message: "Please login first and try again"
        })
    }

    const user = User.findOne({ email: session.user.email });

    if (!user) {
        return res.status(404).json({ status: "Failed", message: "User not found" });
    }

    const { name, lastName, password } = req.body;

    const isValid = verifyPassword(password, user.password);

    if (!isValid) {
        return res.status(422).json({
            status: "Failed",
            message: "Password is incorrect"
        })
    }

    user.name = name;
    user.lastName = lastName;

    user.save();

    return res.status(200).json({ status: "Success", message: "User info updated Successfully" });







}

export default handler;