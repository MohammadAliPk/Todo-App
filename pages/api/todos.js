import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { getSession } from "next-auth/react";

async function handler(req, res) {

    try {
        await connectDB();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "Failed",
            message: "Error connecting to database"
        })
    }

    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ status: "Failed", message: "Please Login" });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
        return res.status(404).json({ status: "Failed", message: "User not found" });
    }


    if (req.method == "POST") {
        const { title, status } = req.body;

        if (!title || !status) {
            return res.status(422).json({ status: "Failed", message: "Please enter valid data" });
        }

        user.todos.push({ title, status });
        user.save();

        res.status(200).json({
            status: "Success", message: "Todo List successfully updated"
        })

    }
}
export default handler;