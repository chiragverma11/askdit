import SignUp from "@/components/SignUp";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { IoArrowBack } from "react-icons/io5";

interface SignUpPageProps {}

const SignUpPage: FC<SignUpPageProps> = ({}) => {
  return (
    <MainContentWrapper>
      <div className="flex h-full max-w-2xl grow flex-col items-center gap-10 px-4 pt-4">
        <Link
          href={"/"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "self-start hover:bg-zinc-200/75 dark:hover:bg-emphasis/50 dark:hover:ring dark:hover:ring-emphasis/60",
          )}
        >
          <IoArrowBack className="mr-2 h-4 w-4" />
          Home
        </Link>
        <SignUp />
      </div>
    </MainContentWrapper>
  );
};

export default SignUpPage;
