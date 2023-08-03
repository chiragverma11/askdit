import Link from "next/link";
import { FC } from "react";
import { Button } from "./ui/Button";
import { Flame, Home, LogOut } from "lucide-react";
import { LuEdit } from "react-icons/lu";
import { HiOutlineUserGroup } from "react-icons/hi";

interface AsideBarProps {}

const AsideBar: FC<AsideBarProps> = ({}) => {
  return (
    <div className="container fixed bottom-4 left-4 top-16 h-[100vh-5%] w-[10%] rounded-3xl bg-zinc-200/40 py-8 shadow-inner ring ring-zinc-300/50 backdrop-blur transition-colors hover:bg-zinc-200/30">
      <ul className="flex flex-col items-center gap-12">
        <li>
          <Button size={"icon"} className="bg-red-500/90 hover:bg-red-500/75">
            <Link href={"/"}>
              <Home className="h-6 w-6 text-white " />
            </Link>
          </Button>
        </li>
        <li>
          <Button size={"icon"} className="bg-zinc-400/30 hover:bg-zinc-400/20">
            <Link href={"/"}>
              <Flame className="h-6 w-6 text-zinc-500" />
            </Link>
          </Button>
        </li>
        <li>
          <Button size={"icon"} className="bg-zinc-400/30 hover:bg-zinc-400/20">
            <Link href={"/"}>
              <LuEdit className="h-6 w-6 text-zinc-500" />
            </Link>
          </Button>
        </li>

        <li>
          <Button size={"icon"} className="bg-zinc-400/30 hover:bg-zinc-400/20">
            <Link href={"/"}>
              <HiOutlineUserGroup className="h-6 w-6 text-zinc-500" />
            </Link>
          </Button>
        </li>
        <li>
          <Button size={"icon"} className="bg-transparent hover:bg-zinc-400/25">
            <Link href={"/"}>
              <LogOut className="h-6 w-6 text-zinc-500" />
            </Link>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default AsideBar;
