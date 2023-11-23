import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { buttonVariants } from "../ui/Button";

interface GeneralSideMenuCardProps {
  title?: string;
  description?: string;
}

const GeneralSideMenuCard: FC<GeneralSideMenuCardProps> = ({
  title = "Home",
  description,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
      <div>
        <p className="text-lg font-semibold">{title}</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <p className="w-full text-sm">
          {description
            ? description
            : "Your personal Askdit homepage. Come here to check in with your favourite communities."}
        </p>
        <Link
          href="/submit"
          className={cn(buttonVariants(), "w-full text-white")}
        >
          Create a Post
        </Link>
        <Link
          href="/communities/create"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full hover:bg-subtle/75",
          )}
        >
          Create a Community
        </Link>
      </div>
    </div>
  );
};

export default GeneralSideMenuCard;
