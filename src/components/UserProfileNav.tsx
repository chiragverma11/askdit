"use client";

import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
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

interface CustomUser extends User {
  username: String;
}
interface UserProfileNavProps {
  user: Pick<CustomUser, "name" | "image" | "email" | "username">;
}

const UserProfileNav: FC<UserProfileNavProps> = ({ user }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="rounded-full outline outline-offset-2 outline-brand-default/50 transition hover:outline-red-500/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
        sideOffset={10}
        className="border-default/40 bg-subtle"
      >
        <div className="flex items-center justify-center p-2">
          <div className="flex flex-col gap-1">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/u/${user.username}`}>
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/r/create"}>
            <HiOutlineUserGroup className="mr-2 h-4 w-4" />
            Create Community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/settings"}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-between"
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <ThemeSwitch />
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            });
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
