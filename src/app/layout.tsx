import Providers from "@/components/Providers";
import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {authModal}

          <div className="h-full min-h-screen bg-gradient-to-b from-red-600/30 from-10% to-zinc-100 to-40% px-2 pt-12">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
