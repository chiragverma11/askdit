import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SettingsHeader from "@/components/settings/SettingsHeader";
import { Separator } from "@/components/ui/Separator";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    absolute: "Askdit Settings",
  },
  openGraph: {
    title: {
      absolute: "Askdit Settings",
    },
    url: absoluteUrl("/settings"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      absolute: "Askdit Settings",
    },
  },
};

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <MainContentWrapper>
      <FeedWrapper>
        <SettingsHeader />
        <Separator className="mb-4 mt-2 bg-emphasis/90" />
        {children}
      </FeedWrapper>
    </MainContentWrapper>
  );
}
