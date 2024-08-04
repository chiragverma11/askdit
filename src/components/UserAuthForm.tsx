"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/Button";

interface UserAuthFormProps {
  authType: "sign-in" | "sign-up";
}

const UserAuthForm: FC<UserAuthFormProps> = ({ authType }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const authTerm = authType === "sign-in" ? "Sign in" : "Sign up";

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: callbackUrl });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto">
      <Button
        onClick={loginWithGoogle}
        variant={"outline"}
        className="rounded-lg border border-default/60 bg-transparent px-6 font-semibold hover:bg-highlight/30 active:scale-100 lg:px-10"
        isLoading={loading}
      >
        {loading ? null : <FcGoogle className="mr-2 h-6 w-6 rounded-lg" />}
        {/* {authTerm} with Google */}
        Continue with Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
