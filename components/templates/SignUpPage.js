import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { FiMail, FiLock, FiUserPlus } from "react-icons/fi";


function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") router.replace("/")
    }, [status])



    const signUpHandler = async () => {
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post("/api/auth/signup", {
                email,
                password
            });
            const data = res.data;
            
            if (data.status === "Success") {
                toast.success(data.message)
                const secRes = await signIn("credentials", {
                    email,
                    password,
                    redirect: false
                })
                if (!secRes.error) {
                    router.replace("/")
                } else {
                    setLoading(false);
                    toast.error(secRes.error);
                }
            } else {
                setLoading(false);
                toast.error(data.message || "Registration failed");
            }

        } catch (err) {
            setLoading(false);
            const errMsg = err.response?.data?.message || "An error occurred";
            toast.error(errMsg);
        }
    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h3>
                    <p className="text-gray-500">Join us to start managing your tasks</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="name@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="text-gray-400" />
                            </div>
                            <input 
                                type="password" 
                                placeholder="Create a strong password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={signUpHandler}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                    >
                        {loading ? "Creating Account..." : <><FiUserPlus /> Register</>}
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage