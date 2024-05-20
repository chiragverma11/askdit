"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";

interface CreatePostButtonProps extends ComponentPropsWithoutRef<typeof Link> {}

const CreatePostButton = forwardRef<
  ElementRef<typeof Link>,
  Omit<CreatePostButtonProps, "href">
>(({ className, ...props }, ref) => {
  const pathname = usePathname();

  const pathnameArray = pathname.split("/");
  const communityName = pathnameArray[1] === "r" ? pathnameArray[2] : null;

  return (
    <Link
      className={cn(
        buttonVariants({ size: "sm" }),
        "flex items-center gap-1 px-1 font-semibold text-white lg:px-4",
        className,
      )}
      href={communityName ? `/r/${communityName}/submit` : "/submit"}
      ref={ref}
      {...props}
    >
      <Icons.plus className="h-5 w-5" strokeWidth={2.5} />
      <span className="hidden lg:inline">Create Post</span>
    </Link>
  );
});

CreatePostButton.displayName = "CreatePostButton";

export default CreatePostButton;
