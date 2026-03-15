import { Suspense } from "react";
import AuthLink from "./AuthLink";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

const SignIn = () => {
  return (
    <div className="flex w-full flex-col justify-center gap-10">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-radial from-brand-default/20 to-subtle/20 drop-shadow backdrop-blur">
          <Icons.logo className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
      </div>
      <Suspense>
        <UserAuthForm authType="sign-in" />
      </Suspense>
      <p className="text-center text-sm">
        Don&apos;t have an account yet?{" "}
        <Suspense>
          <AuthLink
            href="/sign-up"
            paramsAsCallback={true}
            className="font-medium text-sky-600 hover:underline hover:underline-offset-2"
          >
            Sign Up
          </AuthLink>
        </Suspense>
      </p>
    </div>
  );
};

export default SignIn;
