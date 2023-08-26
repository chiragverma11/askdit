"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import { Flame, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { LuEdit } from "react-icons/lu";
import { buttonVariants } from "./ui/Button";

const navItems = [
  { path: "/", name: "Home" },
  { path: "/popular", name: "Popular" },
  { path: "/answer", name: "Answer" },
  { path: "/communities", name: "Communities" },
];

const Items = {
  Home: "Home",
  Popular: "Popular",
  Answer: "Answer",
  Communities: "Communities",
} as const;

interface AsideBarProps {}

const AsideBar: FC<AsideBarProps> = ({}) => {
  const pathname = usePathname() || "/";

  return (
    <nav className="container fixed inset-x-0 bottom-0 z-10 flex h-[4.25rem] w-full items-center justify-center bg-subtle py-8 shadow-inner ring ring-zinc-300/50 backdrop-blur transition-colors dark:ring-0 sm:h-20 lg:inset-x-auto lg:bottom-4 lg:left-4 lg:top-16 lg:my-auto lg:h-[calc(100vh-15%)] lg:w-[10%] lg:rounded-3xl lg:bg-emphasis/80">
      <TooltipProvider skipDelayDuration={500}>
        <ul className="xl:gap flex h-full w-full items-center justify-between lg:flex-col lg:justify-evenly lg:gap-16 2xl:gap-20">
          {navItems.map((item) => {
            const isActive = item.path === pathname;

            const IconComponent =
              item.name === Items.Home ? (
                <Home className="h-6 w-6 text-default" />
              ) : item.name === Items.Popular ? (
                <Flame className="h-6 w-6 text-default" />
              ) : item.name === Items.Answer ? (
                <LuEdit className="h-6 w-6 text-default" />
              ) : item.name === Items.Communities ? (
                <HiOutlineUserGroup className="h-6 w-6 text-default" />
              ) : null;

            return (
              <li key={item.path} data-active={isActive}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={cn(
                        buttonVariants({ size: "icon" }),
                        "w-14",
                        isActive
                          ? "hover:bg-primary/75"
                          : "bg-transparent hover:bg-transparent lg:bg-subtle lg:hover:bg-default",
                      )}
                    >
                      {IconComponent}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="start"
                    alignOffset={25}
                    sideOffset={5}
                    className="hidden px-2 py-1 text-xs lg:block"
                  >
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </TooltipProvider>
    </nav>
  );
};

export default AsideBar;
