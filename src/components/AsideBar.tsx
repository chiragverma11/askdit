import { Flame, Home } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { LuEdit } from "react-icons/lu";
import { Button, buttonVariants } from "./ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

interface AsideBarProps {}

const AsideBar: FC<AsideBarProps> = ({}) => {
  return (
    <div className="container fixed inset-x-0 bottom-0 flex h-[4.25rem] w-full items-center justify-center bg-zinc-200 py-8 shadow-inner ring ring-zinc-300/50 backdrop-blur transition-colors sm:h-20 lg:inset-x-auto lg:bottom-4 lg:left-4 lg:top-16 lg:h-[calc(100vh-15%)] lg:w-[10%] lg:rounded-3xl lg:bg-zinc-200/40 lg:hover:bg-zinc-200/30">
      <TooltipProvider skipDelayDuration={500}>
        <ul className="xl:gap flex h-full w-full items-center justify-between lg:flex-col lg:justify-evenly lg:gap-16 2xl:gap-20">
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"/"}
                  className={cn(
                    buttonVariants({ size: "icon" }),
                    "w-14 bg-red-500/90 hover:bg-red-500/75",
                  )}
                >
                  <Home className="h-6 w-6 text-white " />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                alignOffset={25}
                sideOffset={5}
                className="hidden px-2 py-1 text-xs lg:block"
              >
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </li>
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"/"}
                  className={cn(
                    buttonVariants({ size: "icon" }),
                    "w-14 bg-transparent hover:bg-transparent lg:bg-zinc-400/30 lg:hover:bg-zinc-400/20",
                  )}
                >
                  <Flame className="h-6 w-6 text-zinc-500" />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                alignOffset={25}
                sideOffset={5}
                className="hidden px-2 py-1 text-xs lg:block"
              >
                <p>Popular</p>
              </TooltipContent>
            </Tooltip>
          </li>
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"/"}
                  className={cn(
                    buttonVariants({ size: "icon" }),
                    "w-14 bg-transparent hover:bg-transparent lg:bg-zinc-400/30 lg:hover:bg-zinc-400/20",
                  )}
                >
                  <LuEdit className="h-6 w-6 text-zinc-500" />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                alignOffset={25}
                sideOffset={5}
                className="hidden px-2 py-1 text-xs lg:block"
              >
                <p>Answer</p>
              </TooltipContent>
            </Tooltip>
          </li>

          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"/"}
                  className={cn(
                    buttonVariants({ size: "icon" }),
                    "w-14 bg-transparent hover:bg-transparent lg:bg-zinc-400/30 lg:hover:bg-zinc-400/20",
                  )}
                >
                  <HiOutlineUserGroup className="h-6 w-6 text-zinc-500" />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                alignOffset={25}
                sideOffset={5}
                className="hidden px-2 py-1 text-xs lg:block"
              >
                <p>Communities</p>
              </TooltipContent>
            </Tooltip>
          </li>
          {/* <li>
          <Button size={"icon"} className="bg-transparent hover:bg-zinc-400/25">
            <Link href={"/"}>
              <LogOut className="h-6 w-6 text-zinc-500" />
            </Link>
          </Button>
        </li> */}
        </ul>
      </TooltipProvider>
    </div>
  );
};

export default AsideBar;
