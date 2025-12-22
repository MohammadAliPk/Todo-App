import "../styles/globals.css";

import Providers from "../components/providers/Providers";
import MainLayout from "../components/mainLayout/MainLayout";

export const metadata = {
  title: "Todo App",
  description: "Modern todo app with Next.js App Router"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
