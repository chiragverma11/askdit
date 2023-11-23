"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@mantine/hooks";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Flame, Home, PenSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, HTMLAttributes, useState } from "react";
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
  const { scrollY } = useScroll();
  const [lessVisible, setLessVisible] = useState(false);

  const lg = useMediaQuery("(min-width: 1024px)");

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previousValue = scrollY.getPrevious();
    if (latest > previousValue && latest > 150) {
      setLessVisible(true);
    } else {
      setLessVisible(false);
    }
  });

  return (
    <motion.nav
      variants={{ visible: { opacity: 1 }, lessVisible: { opacity: 0.25 } }}
      animate={!lg && lessVisible ? "lessVisible" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "container fixed bottom-0 z-10 flex w-full items-center justify-center border-t border-t-highlight bg-subtle py-2 shadow-inner ring-zinc-300/50 backdrop-blur dark:ring-0 lg:inset-x-auto lg:bottom-auto lg:my-auto lg:h-[calc(100vh-15%)] lg:max-h-[550px] lg:min-h-[500px] lg:w-32 lg:shrink-0 lg:rounded-3xl lg:border-none lg:bg-emphasis/80 lg:py-8 lg:ring",
        className,
      )}
    >
      <TooltipProvider skipDelayDuration={500}>
        <ul className="flex h-full w-full items-center justify-between sm:max-w-lg lg:w-full lg:flex-col lg:justify-evenly lg:gap-16 2xl:gap-20">
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
                        "group/nav relative w-14 bg-transparent transition-none hover:bg-transparent",
                        isActive
                          ? "text-white hover:dark:bg-black/10"
                          : "text-default/75",
                      )}
                    >
                      {IconComponent}
                      {isActive ? (
                        <motion.div
                          className="absolute inset-0 -z-10 rounded-md bg-primary group-hover/nav:bg-primary/80 group-hover/nav:transition-colors dark:group-hover/nav:bg-primary/95"
                          layoutId="secondaryNavbar"
                          aria-hidden="true"
                          transition={{
                            type: "spring",
                            bounce: 0.01,
                            stiffness: 140,
                            damping: 18,
                            duration: 0.3,
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 -z-20 rounded-md group-hover/nav:transition-colors lg:bg-default lg:group-hover/nav:bg-default/70 dark:lg:group-hover/nav:bg-default/50"></div>
                      )}
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
    </motion.nav>
  );
};

export default AsideBar;
