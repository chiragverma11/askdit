import { FC } from "react";
import AuthLink from "./AuthLink";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

interface SignInProps {}

const SignIn: FC<SignInProps> = ({}) => {
  return (
    <div className="container mx-auto flex flex-col justify-center gap-10">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-radial from-brand-default/20 to-subtle/20 drop-shadow backdrop-blur">
          <Icons.logo className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
      </div>
      <UserAuthForm authType="sign-in" />
      <p className="text-center text-sm">
        Don&apos;t have an account yet?{" "}
        <AuthLink
          href="/sign-up"
          paramsAsCallback={true}
          className="font-medium text-sky-600 hover:underline hover:underline-offset-2"
        >
          Sign Up
        </AuthLink>
      </p>
    </div>
  );
};

export default SignIn;
