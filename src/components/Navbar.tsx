import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Bell, Plus } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Icons } from "./Icons";
import SearchBar from "./SearchBar";
import { Button, buttonVariants } from "./ui/Button";
import UserProfileNav from "./UserProfileNav";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="sticky inset-x-0 top-0 z-[10] h-fit bg-transparent py-2 backdrop-blur-xl">
      <TooltipProvider>
        <div className="container mx-auto flex h-full items-center justify-between gap-2">
          <Link
            href={"/"}
            className={cn(
              buttonVariants(),
              "flex items-center bg-transparent hover:bg-transparent",
            )}
          >
            <Icons.logo className="h-8 w-8 lg:h-6 lg:w-6" />
            <p className="hidden text-xl font-bold text-zinc-700 lg:block">
              skdit
            </p>
          </Link>
          <div className="flex w-3/4 items-center justify-end lg:justify-around">
            <SearchBar className="hidden lg:inline-flex" />

            <Tooltip>
              <TooltipTrigger asChild className="hidden lg:inline-flex">
                <Button
                  className="bg-red-500 px-4 text-white hover:bg-red-500/75"
                  size={"sm"}
                >
                  <Plus className="mr-1 h-5 w-5" /> Create Post
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="px-2 py-1 text-xs"
                sideOffset={7}
              >
                <p>Create Post</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild className="hidden lg:inline-flex">
                <Button
                  className="w-12 bg-red-500 text-white hover:bg-red-500/75"
                  size={"sm"}
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="px-2 py-1 text-xs"
                sideOffset={7}
              >
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>

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
      </TooltipProvider>
    </div>
  );
};

export default Navbar;
