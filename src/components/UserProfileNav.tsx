"use client";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@mantine/hooks";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import AskditAuthorCard from "./AskditAuthorCard";
import { Icons } from "./Icons";
import ThemeSwitch from "./ThemeSwitch";
import UserAvatar from "./UserAvatar";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerItem,
  DrawerTrigger,
} from "./ui/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { Separator } from "./ui/Separator";

interface UserProfileNavProps {
  user: Pick<User, "name" | "image" | "email" | "username">;
}

const UserProfileNav: FC<UserProfileNavProps> = ({ user }) => {
  const isLg = useMediaQuery("(min-width: 1024px)");

  if (isLg) {
    return <UserProfileNavDropdown user={user} />;
  } else if (!isLg) {
    return <UserProfileNavDrawer user={user} />;
  }
};

const UserProfileNavDropdown: FC<UserProfileNavProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <DropdownMenu
      modal={false}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DropdownMenuTrigger
        className={cn(
          "rounded-full transition hover:outline-red-500/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          open
            ? "ring-2 ring-brand-default/50 ring-offset-2 ring-offset-default/75"
            : null,
        )}
      >
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
        sideOffset={10}
        className="rounded-lg border-default/40 bg-emphasis dark:bg-subtle"
      >
        <div className="flex items-center p-2">
          <div className="flex flex-col gap-1 text-sm">
            <p className="font-medium">{user.name} </p>
            <p className="w-52 truncate text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/u/${user.username}`}>
            <Icons.user className="mr-2 h-5 w-5 stroke-[1.75]" />
            Profile
            <span className="ml-1 text-xs text-muted-foreground">
              (u/{user.username})
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={"/communities/create"}>
            <HiOutlineUserGroup className="mr-2 h-5 w-5 stroke-[1.75]" />
            Create Community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={"/settings"}>
            <Icons.settings className="mr-2 h-5 w-5 stroke-[1.75]" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between"
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <ThemeSwitch />
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({ callbackUrl: pathname });
          }}
        >
          <Icons.logout className="mr-2 h-5 w-5 stroke-[1.75]" />
          Sign Out
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1">
          <AskditAuthorCard className="py-0" card={false} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserProfileNavDrawer: FC<UserProfileNavProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open === true) {
          document.documentElement.style.removeProperty("overflow");
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.removeProperty("overflow");
        }
      }}
    >
      <DrawerTrigger
        className={cn(
          "rounded-full transition hover:outline-red-500/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          open
            ? "ring-2 ring-brand-default/50 ring-offset-2 ring-offset-default/75"
            : null,
        )}
      >
        <UserAvatar user={user} />
      </DrawerTrigger>
      <DrawerContent
        className="text-sm"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="py-1">
          <DrawerItem>
            <div className="flex flex-col">
              <p className="text-base font-semibold">{user.name} </p>
              <p className="w-52 truncate text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DrawerItem>

          <Separator className="my-1" />

          <DrawerItem onClick={() => setOpen(false)} asChild>
            <Link
              href={`/u/${user.username}`}
              className="hover:underline hover:underline-offset-2"
            >
              <Icons.user className="mr-2 h-5 w-5 stroke-[1.75]" />
              Profile
              <span className="ml-1 text-xs text-muted-foreground">
                (u/{user.username})
              </span>
            </Link>
          </DrawerItem>
          <DrawerItem onClick={() => setOpen(false)} asChild>
            <Link
              href={"/communities/create"}
              className="hover:underline hover:underline-offset-2"
            >
              <HiOutlineUserGroup className="mr-2 h-5 w-5 stroke-[1.75]" />
              Create Community
            </Link>
          </DrawerItem>
          <DrawerItem onClick={() => setOpen(false)} asChild>
            <Link
              href={"/settings"}
              className="hover:underline hover:underline-offset-2"
            >
              <Icons.settings className="mr-2 h-5 w-5 stroke-[1.75]" />
              Settings
            </Link>
          </DrawerItem>
          <Separator className="my-1" />
          <DrawerItem asChild>
            <div className="flex cursor-pointer items-center justify-between">
              <ThemeSwitch />
            </div>
          </DrawerItem>

          <Separator className="my-1" />

          <DrawerItem
            onClick={() => {
              signOut({ callbackUrl: pathname });
              setOpen(false);
            }}
            asChild
          >
            <div className="hover:underline hover:underline-offset-2">
              <Icons.logout className="mr-2 h-5 w-5 stroke-[1.75]" />
              Sign Out
            </div>
          </DrawerItem>

          <Separator className="my-1" />

          <DrawerFooter className="mt-0 py-2">
            <AskditAuthorCard className="py-0" card={false} />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UserProfileNav;
