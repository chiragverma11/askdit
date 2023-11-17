import "../styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/components/Providers";
import SiteHeader from "@/components/SiteHeader";
import BackgroundShade from "@/components/layout/BackgroundShade";
import { Toaster } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";
import AsideBar from "@/components/AsideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Askdit", template: "%s | Askdit" },
  description:
    "Askdit is a network of communities where people can dive into their interests and ask questions. There's a community for whatever you're interested in on Askdit",
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
          <SiteHeader />
          <AsideBar />
          <main>{children}</main>
          {authModal}
        </Providers>
        <Toaster />
        <BackgroundShade className="z-[-10]" />
      </body>
    </html>
  );
}
