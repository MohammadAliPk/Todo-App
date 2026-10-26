"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn, FiUser } from "react-icons/fi";
import { enableGuestMode, isGuestClient } from "@/utils/guestStorage";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated" || isGuestClient()) {
      router.replace("/");
    }
  }, [status, router]);

  const loginHandler = async e => {
    e?.preventDefault?.();
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
    if (!res?.error) {
      router.replace("/");
    } else {
      toast.error(res.error);
    }
  };

  const guestHandler = async e => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (guestLoading || loading) return;

    setGuestLoading(true);
    try {
      // 1) Local storage + cookie (primary guest path)
      enableGuestMode();

      // 2) Optional JWT guest session (no DB) — avoids "Please enter valid data"
      await signIn("credentials", {
        guest: "true",
        redirect: false
      });

      toast.success("Entered as guest — tasks stay on this device");
      window.location.assign("/");
    } catch (err) {
      // Even if signIn fails, cookie/localStorage guest should still work
      enableGuestMode();
      toast.success("Entered as guest");
      window.location.assign("/");
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
            Sign in, or try the app as a guest with no account.
          </p>
        </div>

        <form
          className="relative space-y-5"
          onSubmit={loginHandler}
          noValidate
        >
          <div>
            <label className="field-label">Email Address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiMail className="text-ink-mute" />
              </div>
              <input
                type="email"
                name="email"
                autoComplete="email"
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
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="field-input pl-10"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || guestLoading}
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

          <div className="relative flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-ink/10" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
              or
            </span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={guestHandler}
            disabled={loading || guestLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-tide/25 bg-tide/5 px-5 py-3 font-semibold text-tide transition-all hover:bg-tide/10 disabled:opacity-70"
          >
            {guestLoading ? (
              "Entering as guest..."
            ) : (
              <>
                <FiUser /> Continue as Guest
              </>
            )}
          </motion.button>

          <p className="text-center text-xs text-ink-mute">
            Guest tasks are stored in your browser (localStorage). No signup
            needed.
          </p>

          <p className="text-center text-sm text-ink-mute">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-tide hover:text-tide-bright"
            >
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginPage;
