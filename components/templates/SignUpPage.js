import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import GoogleButton from "../elements/GoogleButton";


function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") router.replace("/profile")
    }, [status])



    const signUpHandler = async () => {
        try {
            const res = await axios.post("/api/auth/signup", {
                email,
                password
            });
            const data = res.data;
            toast.success(data.message)

            if (data.statusbar === "Success") {
                const secRes = await signIn("credentials", {
                    email,
                    password,
                    redirect: false
                })
                if (!secRes.error) {
                    router.replace("/profile")
                } else {
                    toast.error(secRes.error);
                }
            }

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
            <GoogleButton />
        </div>
    )
}

export default SignUpPage