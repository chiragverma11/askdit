import { FC } from "react";
import AuthLink from "./AuthLink";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

interface SignUpProps {}

const SignUp: FC<SignUpProps> = ({}) => {
  return (
    <div className="container mx-auto flex flex-col justify-center gap-10">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-radial from-brand-default/20 to-subtle/20 drop-shadow backdrop-blur">
          <Icons.logo className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-semibold">Sign Up</h1>
      </div>
      <UserAuthForm authType="sign-up" />
      <p className="text-center text-sm">
        Already have an account?{" "}
        <AuthLink
          href={"/sign-in"}
          paramsAsCallback={true}
          className="font-medium text-sky-600 hover:underline hover:underline-offset-2"
        >
          Sign In
        </AuthLink>
      </p>
    </div>
  );
};

export default SignUp;
