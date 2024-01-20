import { APP_INFO } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { FC } from "react";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";

interface AskditAuthorCardProps extends React.ComponentPropsWithoutRef<"div"> {
  card?: boolean;
}

const AskditAuthorCard: FC<AskditAuthorCardProps> = ({
  card = true,
  className,
  ...props
}) => {
  if (!card) {
    return <AskditAuthorContent className={className} {...props} />;
  }

  return (
    <div
      className={cn(
        "sticky top-[72px] flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4",
        className,
      )}
      {...props}
    >
      <AskditAuthorContent className={className} {...props} />
    </div>
  );
};

const AskditAuthorContent: FC<Omit<AskditAuthorCardProps, "card">> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 text-sm",
        className,
      )}
      {...props}
    >
      <p className="w-full text-subtle">
        Made with ❤️ by{" "}
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
  );
};

export default AskditAuthorCard;
