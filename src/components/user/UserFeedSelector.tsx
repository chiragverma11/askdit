"use client";

import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useIntersection } from "@mantine/hooks";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { ElementRef, FC, useMemo, useRef } from "react";
import { Icons } from "../Icons";
import { Button } from "../ui/Button";

const userProfileMenus = [
  "Posts",
  "Comments",
  "Saved",
  "Questions",
  "Answers",
  "Upvoted",
  "Downvoted",
] as const;

const privateMenus = ["Saved", "Upvoted", "Downvoted"];

type UserMenus = (typeof userProfileMenus)[number];

interface UserFeedSelectorProps {
  isUserSelf: boolean;
  username: string;
}

const capitalizeFirstChar = (str: string) => {
  if (!str) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const UserFeedSelector: FC<UserFeedSelectorProps> = ({
  isUserSelf,
  username,
}) => {
  const segments = useSelectedLayoutSegments();
  const segment = segments[1];
  const currentMenu = segment ? capitalizeFirstChar(segment) : "Posts";

  const activeMenu: UserMenus = currentMenu as UserMenus;

  const menus = isUserSelf
    ? userProfileMenus
    : userProfileMenus.filter((menu) => !privateMenus.includes(menu));

  const selectorContainerRef = useRef<ElementRef<"ul">>(null);

  const { ref: firstItemRef, entry: firstItemEntry } = useIntersection({
    root: selectorContainerRef.current,
    threshold: 1,
  });
  const { ref: lastItemRef, entry: lastItemEntry } = useIntersection({
    root: selectorContainerRef.current,
    threshold: 1,
  });

  const isMounted = useMounted();

  const canScrollPrev = useMemo(
    () => isMounted && !firstItemEntry?.isIntersecting,
    [firstItemEntry?.isIntersecting, isMounted],
  );
  const canScrollNext = useMemo(
    () => isMounted && !lastItemEntry?.isIntersecting,
    [isMounted, lastItemEntry?.isIntersecting],
  );

  return (
    <div className="relative mb-4">
      <Button
        onClick={() => {
          if (canScrollPrev) {
            selectorContainerRef.current?.scrollTo({
              left: 0,
              behavior: "smooth",
            });
          }
        }}
        className={cn(
          "absolute left-0 z-10 my-auto flex aspect-square h-full w-auto items-center justify-center rounded-full bg-transparent hover:bg-highlight/60",
          canScrollPrev ? "" : "hidden",
        )}
        variant={"secondary"}
        size={"icon"}
        disabled={!canScrollPrev}
      >
        <Icons.chevronLeft className="w1/2 h-1/2" />
        <span className="sr-only">Scroll left</span>
      </Button>
      <Button
        onClick={() => {
          if (canScrollNext) {
            selectorContainerRef.current?.scrollTo({
              left: selectorContainerRef.current?.scrollWidth,
              behavior: "smooth",
            });
          }
        }}
        className={cn(
          "absolute right-0 z-10 flex aspect-square h-full w-auto items-center justify-center rounded-full bg-transparent hover:bg-highlight/60",
          canScrollNext ? "" : "hidden",
        )}
        variant={"secondary"}
        size={"icon"}
        disabled={!canScrollNext}
      >
        <Icons.chevronRight className="h-1/2 w-1/2" />
        <span className="sr-only">Scroll left</span>
      </Button>
      <ul
        ref={selectorContainerRef}
        className={cn(
          "no-scrollbar flex h-fit max-w-[100vw] shrink items-center gap-4 overflow-x-scroll px-4 pb-1 sm:overflow-x-auto lg:gap-8",
          canScrollPrev && canScrollNext
            ? "gradient-mask-r-[transparent,transparent_5%,rgba(0,0,0,1.0)_64px,rgba(0,0,0,1.0)_90%,transparent]"
            : !canScrollPrev && canScrollNext
              ? "gradient-mask-r-[black,rgba(0,0,0,1.0)_64px,rgba(0,0,0,1.0)_90%,transparent]"
              : canScrollPrev && !canScrollNext
                ? "gradient-mask-r-[transparent,transparent_5%,rgba(0,0,0,1.0)_64px,rgba(0,0,0,1.0)_100%]"
                : "",
        )}
      >
        {menus.map((menuName, index) => {
          const isActive = menuName === activeMenu;

          return (
            <li
              ref={
                index === 0
                  ? firstItemRef
                  : index === menus.length - 1
                    ? lastItemRef
                    : null
              }
              key={menuName}
            >
              <Link
                href={`/u/${username}/${
                  menuName !== "Posts" ? menuName.toLowerCase() : ""
                }`}
                className="relative font-semibold text-default lg:text-lg"
              >
                {menuName}
                {isActive ? (
                  <motion.div
                    className="absolute inset-x-0 -bottom-1.5 -z-10 h-1 rounded-md bg-primary"
                    layoutId="userProfileMenu"
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
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserFeedSelector;
