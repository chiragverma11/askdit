import { APP_INFO } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";

const AskditAuthorCard = () => {
  return (
    <div className="sticky top-[72px] flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <p className="w-full text-sm text-subtle">
          Made by{" "}
          <Link
            href={APP_INFO.author.github}
            target="_blank"
            referrerPolicy="no-referrer"
            className="font-medium text-default/90 underline underline-offset-2"
          >
            {APP_INFO.author.name}
          </Link>
        </p>
        <Link
          href={APP_INFO.github}
          target="_blank"
          referrerPolicy="no-referrer"
          className={cn(
            buttonVariants({ size: "icon", variant: "ghost" }),
            "aspect-square h-8 w-8 rounded-md hover:bg-highlight/40 dark:hover:bg-highlight",
          )}
        >
          <Icons.github className="h-4 w-4 fill-white dark:fill-black" />
        </Link>
      </div>
    </div>
  );
};

export default AskditAuthorCard;
