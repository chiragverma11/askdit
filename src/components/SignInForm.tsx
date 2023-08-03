"use client";
import { FC, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";

interface SignInFormProps {}

const SignInForm: FC<SignInFormProps> = ({}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <Button
        onClick={loginWithGoogle}
        variant={"outline"}
        className="bg-transparent px-10 font-semibold ring-1 ring-zinc-300 hover:bg-zinc-200/40"
        isLoading={loading}
      >
        <FcGoogle className="mr-2 h-6 w-6 rounded-lg" /> Sign in with Google
      </Button>
    </div>
  );
};

export default SignInForm;
