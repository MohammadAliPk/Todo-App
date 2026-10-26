"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  VscListSelection,
  VscDashboard,
  VscSettingsGear
} from "react-icons/vsc";
import { BiLogOut } from "react-icons/bi";
import { FiMenu, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AmbientScene from "../elements/AmbientScene";
import { clearGuestMode, isGuestClient } from "@/utils/guestStorage";

const nav = [
  { href: "/", label: "Dashboard", icon: VscDashboard },
  { href: "/profile", label: "Settings", icon: VscSettingsGear }
];

const SIDEBAR_KEY = "flowboard-sidebar-open";

function MainLayout({ children }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isAuth =
    pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setIsGuest(isGuestClient());
  }, [pathname]);

  const logoutHandler = async () => {
    if (isGuestClient()) {
      clearGuestMode();
      setIsGuest(false);
      router.replace("/login");
      router.refresh();
      return;
    }
    await signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_KEY);
      if (saved !== null) setOpen(saved === "true");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleDesktop = () => {
    setOpen(prev => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  if (isAuth) {
    return (
      <div className="relative min-h-screen">
        <AmbientScene />
        {children}
      </div>
    );
  }

  const NavLinks = ({ collapsed = false, onNavigate }) =>
    nav.map(({ href, label, icon: Icon }) => {
      const active =
        href === "/" ? pathname === "/" : pathname?.startsWith(href);
      return (
        <Link
          key={href}
          href={href}
          title={label}
          onClick={onNavigate}
          className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
            collapsed ? "justify-center" : ""
          } ${
            active
              ? "bg-tide text-white shadow-lift"
              : "text-ink-soft hover:bg-tide/10 hover:text-tide"
          }`}
        >
          <Icon className="shrink-0 text-lg" />
          {!collapsed && label}
        </Link>
      );
    });

  const SidebarBody = ({ collapsed = false, onNavigate }) => (
    <div className="flex h-full flex-col justify-between">
      <div>
        <Link
          href="/"
          onClick={onNavigate}
          className={`group mb-8 flex items-center gap-3 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span
            className="shape-3d flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-tide to-tide-bright text-white shadow-lift transition-transform duration-500 group-hover:rotate-12"
            style={{
              boxShadow:
                "inset -4px -6px 12px rgba(0,0,0,0.15), 8px 12px 20px rgba(15,118,110,0.35)"
            }}
          >
            <VscListSelection className="text-xl" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-xl font-bold tracking-tight text-ink">
                Flowboard
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-mute">
                Focus · Flow · Finish
              </p>
            </div>
          )}
        </Link>

        <nav className="space-y-2">
          <NavLinks collapsed={collapsed} onNavigate={onNavigate} />
        </nav>

        {isGuest && !collapsed && (
          <p className="mt-6 rounded-xl bg-ember/10 px-3 py-2 text-[11px] font-medium text-ember">
            Guest mode — tasks are saved in this browser only.
          </p>
        )}
      </div>

      {(status === "authenticated" || isGuest) && (
        <button
          onClick={logoutHandler}
          title="Logout"
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-coral transition-colors hover:bg-coral/10 ${
            collapsed ? "justify-center" : "w-full"
          }`}
        >
          <BiLogOut className="text-lg" />
          {!collapsed && "Logout"}
        </button>
      )}
    </div>
  );

  return (
    <div className="relative flex min-h-screen">
      <AmbientScene />

      {/* Desktop sidebar */}
      <aside
        className={`fixed z-20 hidden h-full flex-col p-4 transition-all duration-300 md:flex ${
          open ? "w-64" : "w-[88px]"
        }`}
      >
        <motion.div
          layout
          className="glass-panel-strong relative flex h-full flex-col rounded-3xl p-4"
        >
          <SidebarBody collapsed={!open} />

          <button
            type="button"
            onClick={toggleDesktop}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            className="absolute -right-3 top-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-white text-tide shadow-lift transition-transform hover:scale-110"
          >
            {open ? <FiChevronLeft size={14} /> : <FiChevronRight size={14} />}
          </button>
        </motion.div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 border-b border-white/50 bg-white/70 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-ink-soft hover:bg-tide/10 hover:text-tide"
          >
            <FiMenu size={22} />
          </button>
          <Link href="/" className="font-display text-lg font-bold text-ink">
            Flowboard
          </Link>
          <div className="w-10" />
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 p-4 md:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="glass-panel-strong relative h-full rounded-3xl p-5">
                <button
                  type="button"
                  aria-label="Close sidebar"
                  onClick={() => setMobileOpen(false)}
                  className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-mute hover:bg-ink/5 hover:text-ink"
                >
                  <FiX size={20} />
                </button>
                <SidebarBody onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main
        className={`relative z-10 flex-1 px-4 pb-10 pt-20 transition-all duration-300 md:px-8 md:pt-8 ${
          open ? "md:ml-64" : "md:ml-[88px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
