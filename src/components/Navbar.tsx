import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Bell, Plus } from "lucide-react";
import Link from "next/link";
import { Icons } from "./Icons";
import SearchBar from "./SearchBar";
import { Button, buttonVariants } from "./ui/Button";
import UserProfileNav from "./UserProfileNav";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit py-2">
      <div className="container mx-auto flex h-full items-center justify-between gap-2">
        <Link href={"/"} className="flex ">
          <Icons.logo className="h-6 w-6" />
          <p className="text-xl font-bold text-zinc-700">skdit</p>
        </Link>
        <div className="flex w-3/4 items-center justify-around">
          <SearchBar />
          <Button
            className="bg-red-500 text-white hover:bg-red-500/75"
            size={"sm"}
          >
            <Plus className="mr-1 h-5 w-5" /> Create New
          </Button>
          <Button
            className="w-12 bg-red-500 text-white hover:bg-red-500/75"
            size={"sm"}
          >
            <Bell className="h-5 w-5" />
          </Button>
          {session?.user ? (
            <UserProfileNav user={session.user} />
          ) : (
            <Link
              href={"/sign-in"}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "border-2 border-red-500/50 font-semibold text-zinc-700 hover:bg-zinc-200/50",
              )}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
