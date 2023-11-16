import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Bell, Plus } from "lucide-react";
import Link from "next/link";
import AuthLink from "./AuthLink";
import { Icons } from "./Icons";
import SearchBar from "./SearchBar";
import UserProfileNav from "./UserProfileNav";
import { Button, buttonVariants } from "./ui/Button";

const SiteHeader = async () => {
  const session = await getAuthSession();
  return (
    <header className="sticky inset-x-0 top-0 z-[51] h-fit bg-transparent py-2 backdrop-blur-md">
      <TooltipProvider>
        <div className="container mx-auto flex h-full items-center justify-between gap-2">
          <Link
            href={"/"}
            className={cn(
              buttonVariants(),
              "py- flex items-center bg-transparent px-1 py-0 hover:bg-transparent active:scale-100",
            )}
          >
            <Icons.logo className="h-8 w-8 lg:hidden lg:h-6 lg:w-6" />
            <Icons.logoWithText className="hidden h-8 w-full lg:h-6 dark:lg:block" />
            <Icons.logoWithDarkText className="hidden h-8 w-full dark:hidden lg:block lg:h-6" />
          </Link>
          <nav className="flex w-3/4 items-center justify-end lg:justify-around">
            <SearchBar className="hidden lg:inline-flex" />

            <Tooltip>
              <TooltipTrigger asChild className="hidden lg:inline-flex">
                <Button
                  className="bg-red-500 px-4 font-semibold text-white hover:bg-red-500/75"
                  size={"sm"}
                >
                  <Plus className="mr-1 h-5 w-5" strokeWidth={2.5} /> Create
                  Post
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
              <TooltipTrigger
                asChild
                className="hidden bg-emphasis lg:inline-flex"
              >
                <Button
                  className="relative w-12 border border-default/25 bg-emphasis font-semibold text-default transition-none hover:bg-subtle hover:transition-colors"
                  size={"sm"}
                >
                  <Bell className="h-6 w-6" strokeWidth={2.25} />
                  <span className="absolute right-[0.90rem] top-2 h-2 w-2 rounded-full bg-brand-default"></span>
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
              <AuthLink
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "border-2 border-brand-default/50 font-semibold text-default hover:border-brand-default/75 hover:bg-zinc-200/50 dark:hover:bg-transparent",
                )}
              >
                Sign In
              </AuthLink>
            )}
          </nav>
        </div>
      </TooltipProvider>
    </header>
  );
};

export default SiteHeader;
