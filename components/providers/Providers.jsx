"use client";

import { SessionProvider } from "next-auth/react";
import { ToastConfig } from "@/utils/toastConfig";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
      <ToastConfig />
    </SessionProvider>
  );
}
