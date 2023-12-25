import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";


function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") router.replace("/dashboard")
    }, [status])



    const signUpHandler = async () => {
        try {
            const res = await axios.post("/api/auth/signup", {
                email,
                password
            });
            const data = res.data;
            toast.success(data.message)

        } catch (err) {
            const errMsg = err.response.data.message;
            toast.error(errMsg);
        }
    }



    return (
        <div className="signin-form">
            <h3>Registration Form</h3>
            <input type="text" placeholder="Email ..." onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Password ..." onChange={(e) => setPassword(e.target.value)} />
            <button onClick={signUpHandler}>Register</button>
            <div>
                <p>Have an account?</p>
                <Link href="/login">Login</Link>
            </div>
        </div>
    )
}

export default SignUpPage