"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const loginHandler = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    setLoading(false);
    if (!res.error) {
      router.replace("/");
    } else {
      toast.error(res.error);
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
          className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-3xl bg-gradient-to-br from-tide-glow/40 to-tide/20"
          style={{
            transform: "rotateX(40deg) rotateZ(-20deg)",
            boxShadow: "12px 18px 30px rgba(15,118,110,0.2)"
          }}
        />

        <div className="relative mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tide">
            Flowboard
          </p>
          <h3 className="font-display text-3xl font-bold text-ink">
            Welcome Back
          </h3>
          <p className="mt-2 text-ink-mute">
            Sign in and pick up where the flow left off.
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
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="field-input pl-10"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loginHandler}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <FiLogIn /> Sign In
              </>
            )}
          </motion.button>

          <p className="text-center text-sm text-ink-mute">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-tide hover:text-tide-bright"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
