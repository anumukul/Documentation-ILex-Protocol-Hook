import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ILex Protocol — Documentation",
  description:
    "Automated impermanent loss protection and yield parking for Uniswap v4 liquidity providers, powered by Reactive Network.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 px-6 py-8 md:px-10 lg:px-16 max-w-5xl">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
