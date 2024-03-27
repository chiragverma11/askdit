"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { FC } from "react";

interface HorizontalMenuItem {
  name: string;
  href: string;
}

interface HorizontalMenuProps extends React.ComponentPropsWithoutRef<"ul"> {
  items: HorizontalMenuItem[];
  isActive: (item: HorizontalMenuItem) => boolean;
}

const HorizontalMenu: FC<HorizontalMenuProps> = ({
  items,
  isActive,
  className,
  ...props
}) => {
  return (
    <ul
      className={cn(
        "mb-1 flex max-w-[100vw] shrink items-center gap-4 overflow-x-scroll px-4 pb-3 sm:overflow-x-auto lg:gap-8",
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const active = isActive(item);

        return (
          <li key={item.name}>
            <Link
              href={item.href}
              className="relative font-semibold text-default lg:text-lg"
            >
              {item.name}
              {active && (
                <motion.div
                  className="absolute inset-x-0 -bottom-1.5 -z-10 h-1 rounded-md bg-primary"
                  layoutId="horizontalMenuIndicator"
                  aria-hidden="true"
                  transition={{
                    type: "spring",
                    bounce: 0.01,
                    stiffness: 140,
                    damping: 18,
                    duration: 0.3,
                  }}
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default HorizontalMenu;
