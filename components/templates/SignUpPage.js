"use client";

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUserPlus } from "react-icons/fi";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

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
        toast.success(data.message);
        const secRes = await signIn("credentials", {
          email,
          password,
          redirect: false
        });
        if (!secRes.error) {
          router.replace("/");
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
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 32, rotateX: 14 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        style={{ transformPerspective: 1000 }}
        className="glass-panel-strong relative w-full max-w-md overflow-hidden rounded-3xl p-8"
      >
        <div
          className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-tr from-ember-soft/45 to-ember/15"
          style={{
            boxShadow: "10px 16px 28px rgba(217,119,6,0.2)"
          }}
        />

        <div className="relative mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tide">
            Flowboard
          </p>
          <h3 className="font-display text-3xl font-bold text-ink">
            Create Account
          </h3>
          <p className="mt-2 text-ink-mute">
            Join and start shipping tasks with style.
          </p>
        </div>

        <div className="relative space-y-5">
          <div>
            <label className="field-label">Email Address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiMail className="text-ink-mute" />
              </div>
              <input
                type="text"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="field-input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiLock className="text-ink-mute" />
              </div>
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="field-input pl-10"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={signUpHandler}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                <FiUserPlus /> Register
              </>
            )}
          </motion.button>

          <p className="text-center text-sm text-ink-mute">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-tide hover:text-tide-bright"
            >
              Login
            </Link>
            {" · "}
            <Link
              href="/login"
              className="font-semibold text-tide hover:text-tide-bright"
            >
              Continue as Guest
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUpPage;
