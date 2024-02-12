"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AnimatePresence, motion } from "framer-motion";
import { Session } from "next-auth";
import { FC, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { ScrollArea } from "../ui/Scroll-Area";
import CommunitiesFallback from "./CommunitiesFallback";
import ExploreCommunities from "./ExploreCommunities";
import YourCommunities from "./YourCommunities";

interface CommunitiesProps {
  session: Session | null;
  explore: boolean;
}

const Communities: FC<CommunitiesProps> = ({ session, explore }) => {
  const [activeMenu, setActiveMenu] = useState<"Your Communities" | "Explore">(
    explore ? "Explore" : "Your Communities",
  );
  const [parent, enableAnimations] = useAutoAnimate();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-6 px-4 lg:gap-10">
        {["Your Communities", "Explore"].map((menuName) => {
          const isActive = menuName === activeMenu;
          const menu = menuName as typeof activeMenu;

          return (
            <h1
              className="relative cursor-pointer text-xl font-semibold text-default lg:text-2xl"
              key={menuName}
              onClick={() => {
                setActiveMenu(menu);
              }}
            >
              {menuName}
              {isActive ? (
                <motion.div
                  className="absolute inset-x-0 -bottom-2 -z-10 h-1 rounded-md bg-primary"
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
            </h1>
          );
        })}
      </div>
      <ScrollArea className="h-[calc(var(--mobile-height-adjusted)-68px)] lg:h-[calc(var(--height-adjusted)-68px)]">
        <div
          className="flex w-full flex-col items-center gap-4 px-4 pb-16 lg:max-h-none lg:pb-4 lg:pr-4"
          ref={parent}
        >
          <AnimatePresence>
            {!session ? (
              <CommunitiesFallback type="unauthenticated" />
            ) : activeMenu === "Your Communities" ? (
              <YourCommunities session={session} />
            ) : (
              <ExploreCommunities session={session} />
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Communities;
