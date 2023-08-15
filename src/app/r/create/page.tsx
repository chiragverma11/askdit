import CreateCommunityForm from "@/components/CreateCommunityForm";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { IoArrowBack } from "react-icons/io5";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-10 py-6 pt-4">
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
      <div className="container mx-auto flex flex-col justify-center gap-10">
        <div className="flex flex-col gap-6">
          <h1>Create a Community</h1>
        </div>
        <CreateCommunityForm />
      </div>
    </div>
  );
};

export default page;
