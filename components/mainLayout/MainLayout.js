"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  VscListSelection,
  VscDashboard,
  VscSettingsGear
} from "react-icons/vsc";
import { BiLogOut } from "react-icons/bi";
import { signOut, useSession } from "next-auth/react";
import AmbientScene from "../elements/AmbientScene";

const nav = [
  { href: "/", label: "Dashboard", icon: VscDashboard },
  { href: "/profile", label: "Settings", icon: VscSettingsGear }
];

function MainLayout({ children }) {
  const { status } = useSession();
  const pathname = usePathname();
  const isAuth =
    pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  if (isAuth) {
    return (
      <div className="relative min-h-screen">
        <AmbientScene />
        {children}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen">
      <AmbientScene />

      <aside className="fixed z-20 hidden h-full w-64 flex-col justify-between p-5 md:flex">
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="glass-panel-strong flex h-full flex-col justify-between rounded-3xl p-6"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div>
            <Link href="/" className="group mb-10 flex items-center gap-3">
              <span
                className="shape-3d flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-tide to-tide-bright text-white shadow-lift transition-transform duration-500 group-hover:rotate-12"
                style={{
                  boxShadow:
                    "inset -4px -6px 12px rgba(0,0,0,0.15), 8px 12px 20px rgba(15,118,110,0.35)"
                }}
              >
                <VscListSelection className="text-xl" />
              </span>
              <div>
                <p className="font-display text-xl font-bold tracking-tight text-ink">
                  Flowboard
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-mute">
                  Focus · Flow · Finish
                </p>
              </div>
            </Link>

            <nav className="space-y-2">
              {nav.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                      active
                        ? "bg-tide text-white shadow-lift"
                        : "text-ink-soft hover:bg-tide/10 hover:text-tide"
                    }`}
                  >
                    <Icon className="text-lg" />
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-glow"
                        className="absolute inset-0 -z-10 rounded-xl bg-tide"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {status === "authenticated" && (
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-coral transition-colors hover:bg-coral/10"
            >
              <BiLogOut className="text-lg" /> Logout
            </button>
          )}
        </motion.div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-20 border-b border-white/50 bg-white/70 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-bold text-ink">
            Flowboard
          </Link>
          <div className="flex gap-2">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className="rounded-lg p-2 text-ink-soft hover:bg-tide/10 hover:text-tide"
              >
                <Icon className="text-xl" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <main className="relative z-10 flex-1 px-4 pb-10 pt-20 md:ml-64 md:px-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
