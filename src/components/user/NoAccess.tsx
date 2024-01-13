"use client";

import Link from "next/link";
import { Icons } from "../Icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/Button";

export default function NoAccess() {
  return (
    <div className="flex h-[calc(var(--mobile-height-adjusted)-48px)] w-full flex-col items-center justify-center rounded-xl p-6 md:bg-emphasis lg:h-[450px]">
      <div className="flex flex-col items-center gap-4">
        <Icons.blocked className="h-8 w-8" strokeWidth={2.75} />
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-lg font-medium">
            You do not have permission to access this resource.
          </p>
          <p className="text-[0.9375rem] leading-snug text-subtle">
            You can only look at your own saved/voted posts and comments.
          </p>
        </div>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
        >
          Take me home
        </Link>
      </div>
    </div>
  );
}
