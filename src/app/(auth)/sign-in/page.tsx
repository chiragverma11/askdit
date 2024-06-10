import BackButton from "@/components/BackButton";
import SignIn from "@/components/SignIn";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { FC } from "react";

export const metadata: Metadata = {
  title: "Sign in",
  openGraph: {
    title: "Sign in",
    url: absoluteUrl("/sign-in"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign in",
  },
};

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = ({}) => {
  return (
    <MainContentWrapper>
      <div className="flex h-full max-w-2xl grow flex-col items-center gap-10 px-4 pt-4">
        <BackButton className="flex aspect-auto h-auto w-auto items-center gap-1 self-start p-2 font-medium">
          Back
        </BackButton>
        <SignIn />
      </div>
    </MainContentWrapper>
  );
};

export default SignInPage;
