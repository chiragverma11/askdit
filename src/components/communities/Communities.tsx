"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AnimatePresence } from "framer-motion";
import { Session } from "next-auth";
import { FC, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import HorizontalMenu from "../HorizontalMenu";
import { ScrollArea } from "../ui/Scroll-Area";
import CommunitiesFallback from "./CommunitiesFallback";
import ExploreCommunities from "./ExploreCommunities";
import YourCommunities from "./YourCommunities";

const communitiesMenus = ["Your Communities", "Explore"] as const;

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
      <HorizontalMenu
        menuId="_communitiesMenu"
        items={communitiesMenus.map((menuName) => ({
          name: menuName,
          href: `${menuName === "Explore" ? "/communities?explore=true" : "/communities"}`,
          className: "relative text-xl font-semibold text-default lg:text-2xl",
          onClick: () => setActiveMenu(menuName),
        }))}
        isActive={(item) => item.name === activeMenu}
        listContainerProps={{ className: "gap-6 pb-0 lg:gap-10" }}
      />
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
