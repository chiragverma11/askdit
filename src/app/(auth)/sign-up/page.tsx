import BackButton from "@/components/BackButton";
import SignUp from "@/components/SignUp";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { FC } from "react";

export const metadata: Metadata = {
  title: "Sign up",
  openGraph: {
    title: "Sign up",
    url: absoluteUrl("/sign-up"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign up",
  },
};

interface SignUpPageProps {}

const SignUpPage: FC<SignUpPageProps> = ({}) => {
  return (
    <MainContentWrapper>
      <div className="flex h-full max-w-2xl grow flex-col items-center gap-10 px-4 pt-4">
        <BackButton className="flex aspect-auto h-auto w-auto items-center gap-1 self-start p-2 font-medium">
          Back
        </BackButton>

        <SignUp />
      </div>
    </MainContentWrapper>
  );
};

export default SignUpPage;
