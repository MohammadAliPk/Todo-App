import { Syne, Figtree } from "next/font/google";
import "../styles/globals.css";

import Providers from "../components/providers/Providers";
import MainLayout from "../components/mainLayout/MainLayout";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap"
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap"
});

export const metadata = {
  title: "Flowboard — Todo App",
  description: "A polished Kanban todo experience built with Next.js"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${figtree.variable}`}>
      <body className="font-sans">
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
