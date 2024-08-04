import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AuthLink from "./AuthLink";
import CreatePostButton from "./CreatePostButton";
import { Icons } from "./Icons";
import SearchBar from "./SearchBar";
import UserProfileNav from "./UserProfileNav";
import Notifications from "./notification/Notifications";
import { buttonVariants } from "./ui/Button";

const SiteHeader = async () => {
  const session = await getAuthSession();
  return (
    <header className="sticky inset-x-0 top-0 z-[51] bg-transparent backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between gap-2 px-4 sm:px-8">
        <Link
          href={"/"}
          className={cn(
            buttonVariants(),
            "flex items-center bg-transparent px-1 py-0 hover:bg-transparent active:scale-100",
          )}
        >
          <Icons.logo className="h-8 w-8 lg:hidden lg:h-6 lg:w-6" />
          <Icons.logoWithText className="hidden h-8 w-full lg:h-6 dark:lg:block" />
          <Icons.logoWithDarkText className="hidden h-8 w-full dark:hidden lg:block lg:h-6" />
        </Link>
        <nav className="flex w-3/4 items-center justify-end gap-2 lg:justify-around lg:gap-0">
          <SearchBar />

          <CreatePostButton className="w-10 lg:w-auto" />

          {session?.user && <Notifications />}

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
    </header>
  );
};

export default SiteHeader;
