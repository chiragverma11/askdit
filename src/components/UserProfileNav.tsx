"use client";

import { User } from "next-auth";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";

interface UserProfileNavProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserProfileNav: FC<UserProfileNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
        <DropdownMenuItem>
          <Settings className="mr-1 h-4 w-4" />
          <Link href={"/settings"}>Settings</Link>
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
          <LogOut className="mr-1 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileNav;
