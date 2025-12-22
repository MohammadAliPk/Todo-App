import "../styles/globals.css";

import Providers from "../components/providers/Providers";
import Layout from "../components/layout/Layout";

export const metadata = {
  title: "Todo App",
  description: "Modern todo app with Next.js App Router"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
