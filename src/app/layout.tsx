import "../styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import AsideBar from "@/components/AsideBar";
import Providers from "@/components/Providers";
import SiteHeader from "@/components/SiteHeader";
import BackgroundShade from "@/components/layout/BackgroundShade";
import { Toaster } from "@/components/ui/Sonner";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "hsl(0, 8% ,90%)" },
    { media: "(prefers-color-scheme: dark)", color: "hsl(0, 0% ,10%)" },
  ],
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: [
    siteConfig.name,
    "Next.js",
    "React",
    "TailwindCSS",
    "Shadcn",
    siteConfig.author.name,
    "Reddit alternative",
    "Ask questions",
    "Share knowledge",
  ],
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.github }],
  creator: siteConfig.author.name,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.author.twitter_username,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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

          <div className="mx-auto flex max-w-[1400px] flex-row justify-center">
            <div className="relative lg:flex lg:w-[14.1%] lg:flex-col lg:items-start xl:w-1/5">
              <div className="flex items-start lg:ml-4 lg:pt-4">
                <AsideBar className="w-full" />
              </div>
            </div>

            <main className="flex max-w-[100vw] grow justify-center">
              {children}
            </main>
          </div>

          {authModal}
          <Toaster richColors />
        </Providers>
        <BackgroundShade className="z-[-10]" />
      </body>
    </html>
  );
}
