import { FC } from "react";
import { Icons } from "./Icons";
import Link from "next/link";
import SignInForm from "./SignInForm";

interface SignInProps {}

const SignIn: FC<SignInProps> = ({}) => {
  return (
    <div className="container mx-auto flex flex-col justify-center gap-10">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-radial from-red-200 to-zinc-200 drop-shadow backdrop-blur">
          <Icons.logo className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
      </div>
      <SignInForm />
      <p className="text-center text-sm">
        Don&apos;t have an account yet?{" "}
        <Link
          href={"/sign-up"}
          className="font-semibold text-zinc-900 hover:underline hover:underline-offset-2"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
