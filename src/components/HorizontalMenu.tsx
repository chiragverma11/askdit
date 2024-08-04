"use client";

import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useDebouncedValue, useIntersection } from "@mantine/hooks";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { FC, useMemo, useRef } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/Button";

interface HorizontalMenuItem
  extends React.ComponentPropsWithoutRef<typeof Link> {
  name: string;
}

interface HorizontalMenuProps extends React.ComponentPropsWithoutRef<"div"> {
  menuId: string;
  items: HorizontalMenuItem[];
  isActive: (item: HorizontalMenuItem) => boolean;
  listContainerProps?: React.ComponentPropsWithoutRef<"ul">;
}

const HorizontalMenu: FC<HorizontalMenuProps> = ({
  menuId,
  items,
  isActive,
  listContainerProps,
  className,
  ...props
}) => {
  const menuListRef = useRef<React.ElementRef<"ul">>(null);

  const { ref: firstItemRef, entry: firstItemEntry } = useIntersection({
    root: menuListRef.current,
    threshold: 1,
  });
  const { ref: lastItemRef, entry: lastItemEntry } = useIntersection({
    root: menuListRef.current,
    threshold: 1,
  });

  const [isMounted] = useDebouncedValue(useMounted(), 100); // Use debounced value to avoid flickering

  const canScrollPrev = useMemo(
    () => isMounted && !firstItemEntry?.isIntersecting,
    [firstItemEntry?.isIntersecting, isMounted],
  );
  const canScrollNext = useMemo(
    () => isMounted && !lastItemEntry?.isIntersecting,
    [isMounted, lastItemEntry?.isIntersecting],
  );

  const { className: listContainerClassName, ..._listContainerProps } =
    listContainerProps || {};

  return (
    <div
      className={cn("relative w-full overflow-x-hidden", className)}
      {...props}
    >
      <Button
        onClick={() => {
          if (canScrollPrev) {
            menuListRef.current?.scrollTo({
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
            menuListRef.current?.scrollTo({
              left: menuListRef.current?.scrollWidth,
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
        ref={menuListRef}
        className={cn(
          "no-scrollbar flex h-fit shrink items-center gap-4 overflow-x-scroll px-4 pb-1 lg:gap-8",
          listContainerClassName,
          canScrollPrev && canScrollNext
            ? "gradient-mask-r-[transparent,transparent_5%,rgba(0,0,0,1.0)_64px,rgba(0,0,0,1.0)_90%,transparent]"
            : !canScrollPrev && canScrollNext
              ? "gradient-mask-r-[black,rgba(0,0,0,1.0)_64px,rgba(0,0,0,1.0)_90%,transparent]"
              : canScrollPrev && !canScrollNext
                ? "gradient-mask-r-[transparent,transparent_5%,rgba(0,0,0,1.0)_64px,rgba(0,0,0,1.0)_100%]"
                : "overflow-x-visible sm:overflow-x-visible",
        )}
        {..._listContainerProps}
      >
        {items.map((item, index) => {
          const isItemActive = isActive(item);
          const { name, href, className, ...props } = item;

          return (
            <li
              ref={
                index === 0
                  ? firstItemRef
                  : index === items.length - 1
                    ? lastItemRef
                    : null
              }
              key={name}
            >
              <Link
                href={href}
                className={cn(
                  "relative font-semibold text-default lg:text-lg",
                  className,
                )}
                {...props}
              >
                {name}
                {isItemActive ? (
                  <motion.div
                    className="absolute inset-x-0 -bottom-1.5 -z-10 h-1 rounded-md bg-primary"
                    layoutId={menuId}
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

export default HorizontalMenu;
