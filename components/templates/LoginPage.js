import { useState } from "react";
import { signIn } from "next-auth/react"
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const loginHandler = async () => {
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false
        })
        if (!res.error) {
            router.replace("/dashboard")
        } else {
            toast.error(res.error);
        }
    }


    return (
        <div className="signin-form">
            <h3>Login Form</h3>
            <input type="text" placeholder="Email ..." onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Password ..." onChange={(e) => setPassword(e.target.value)} />
            <button onClick={loginHandler}>Register</button>
            <div>
                <p>Create an account?</p>
                <Link href="/signup">Sign up</Link>
            </div>
        </div>
    )
}

export default LoginPage