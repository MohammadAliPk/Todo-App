import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { getSession } from "next-auth/react";

async function handler(req, res) {

    if (req.method !== "POST") return;

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

    const { id, status, title, description } = req.body;

    if (!id || !status || !title || !description) return res.status(422).json({ status: "Failed", message: "Please enter valid data" });

    const result = await User.updateOne({ "todos._id": id }, { $set: { "todos.$.status": status, "todos.$.title": title, "todos.$.description": description } });

    res.status(200).json({ status: "Success", message: "Todo successfully updated" });

}
export default handler; 