"use client";
import { FC, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";

interface UserAuthFormProps {
  authType: "sign-in" | "sign-up";
}

const UserAuthForm: FC<UserAuthFormProps> = ({ authType }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const authTerm = authType === "sign-in" ? "Sign in" : "Sign up";

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto">
      <Button
        onClick={loginWithGoogle}
        variant={"outline"}
        className="bg-transparent px-6 font-semibold ring-1 ring-zinc-300 hover:bg-zinc-200/40 active:scale-100 lg:px-10"
        isLoading={loading}
      >
        {loading ? null : <FcGoogle className="mr-2 h-6 w-6 rounded-lg" />}
        {authTerm} with Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
