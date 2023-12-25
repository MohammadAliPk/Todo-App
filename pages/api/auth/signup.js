import User from "@/models/User";
import { hashPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";

async function handler(req, res) {


    if (req.method !== "POST") return;


    // Connect to DB
    try {
        await connectDB();
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "Failed",
            message: "Error connecting to database"
        })
    }

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({
            status: "Failed", message: "Please enter valid data"
        });
        return;
    }


    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        res.status(422).json({
            status: "Failed",
            message: "User already exists with this email"
        })
        return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({ email: email, password: hashedPassword });

    res.status(201).json({
        statusbar: "Success",
        message: "User created successfully"
    })

}

export default handler;