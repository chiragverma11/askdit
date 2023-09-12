"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Flame, Home, PenSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, HTMLAttributes } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
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

interface AsideBarProps extends HTMLAttributes<HTMLElement> {}

const AsideBar: FC<AsideBarProps> = ({ className }) => {
  const pathname = usePathname() || "/";

  return (
    <nav
      className={cn(
        "container fixed inset-x-0 bottom-0 z-10 flex w-full items-center justify-center border-t border-t-highlight bg-subtle py-2 shadow-inner ring ring-zinc-300/50 backdrop-blur transition-colors dark:ring-0 sm:h-20 lg:inset-x-auto lg:bottom-4 lg:left-4 lg:top-16 lg:my-auto lg:h-[calc(100vh-15%)] lg:max-h-[600px] lg:w-32 lg:rounded-3xl lg:border-none lg:bg-emphasis/80",
        className,
      )}
    >
      <TooltipProvider skipDelayDuration={500}>
        <ul className="xl:gap flex h-full w-full items-center justify-between lg:flex-col lg:justify-evenly lg:gap-16 2xl:gap-20">
          {navItems.map((item) => {
            const isActive = item.path === pathname;

            const IconComponent =
              item.name === Items.Home ? (
                <Home className="h-6 w-6 text-inherit" />
              ) : item.name === Items.Popular ? (
                <Flame className="h-6 w-6 text-inherit" />
              ) : item.name === Items.Answer ? (
                <PenSquare className="h-6 w-6 text-inherit" />
              ) : item.name === Items.Communities ? (
                <HiOutlineUserGroup className="h-6 w-6 text-inherit" />
              ) : null;

            return (
              <li key={item.path} data-active={isActive}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={cn(
                        buttonVariants({ size: "icon" }),
                        "relative w-14 bg-transparent hover:bg-transparent ",
                        isActive
                          ? "text-white hover:bg-white/20 hover:dark:bg-black/10"
                          : "text-default/75 lg:bg-default lg:hover:bg-default/70 dark:lg:hover:bg-default/50",
                      )}
                    >
                      {IconComponent}
                      {isActive ? (
                        <motion.div
                          className="absolute inset-0 -z-10 rounded-md bg-primary"
                          layoutId="communitiesMenu"
                          aria-hidden="true"
                          transition={{
                            type: "spring",
                            bounce: 0.01,
                            stiffness: 140,
                            damping: 18,
                            duration: 0.3,
                          }}
                        />
                      ) : null}
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
