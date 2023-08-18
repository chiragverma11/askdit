import SignIn from "@/components/SignIn";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { IoArrowBack } from "react-icons/io5";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center gap-10 px-4 pt-4">
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
      <SignIn />
    </div>
  );
};

export default page;
