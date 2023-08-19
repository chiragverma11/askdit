import Providers from "@/components/Providers";
import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Askdit",
  description:
    "A Social media which focuses on creating communities and asking questions",
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", inter.className)}>
        <Providers>
          <div className="fixed inset-0 z-[-10] max-h-screen bg-gradient-to-b from-brand-default/30 from-0% to-30% dark:from-brand-default/20 "></div>
          <header className="sticky inset-x-0 top-0 z-[10]">
            <Navbar />
          </header>

          {authModal}
          <main>{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
