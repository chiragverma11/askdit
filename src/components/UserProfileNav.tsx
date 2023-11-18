"use client";

import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import ThemeSwitch from "./ThemeSwitch";
import UserAvatar from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { cn } from "@/lib/utils";

interface CustomUser extends User {
  username: String;
}
interface UserProfileNavProps {
  user: Pick<CustomUser, "name" | "image" | "email" | "username">;
}

const UserProfileNav: FC<UserProfileNavProps> = ({ user }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu
      modal={false}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DropdownMenuTrigger
        className={cn(
          "rounded-full transition hover:outline-red-500/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isOpen
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
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
            <span className="ml-1 text-xs text-muted-foreground">
              ({user.username})
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={"/communities/create"}>
            <HiOutlineUserGroup className="mr-2 h-4 w-4" />
            Create Community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={"/settings"}>
            <Settings className="mr-2 h-4 w-4" />
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
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileNav;
