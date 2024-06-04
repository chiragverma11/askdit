import BackButton from "@/components/BackButton";
import SignUp from "@/components/SignUp";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { FC } from "react";

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
