"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/Button";

interface CreatePostButtonProps
  extends ComponentPropsWithoutRef<typeof Button> {}

const CreatePostButton = forwardRef<
  ElementRef<typeof Button>,
  CreatePostButtonProps
>(({ className, onClick, ...props }, ref) => {
  const pathname = usePathname();
  const router = useRouter();

  const pathnameArray = pathname.split("/");
  const communityName = pathnameArray[1] === "r" ? pathnameArray[2] : null;

  return (
    <Button
      className={cn(
        "flex items-center gap-1 px-1 font-semibold text-white lg:px-4",
        className,
      )}
      size={"sm"}
      onClick={(e) => {
        router.push(communityName ? `/r/${communityName}/submit` : "/submit");
        if (onClick) {
          onClick(e);
        }
      }}
      ref={ref}
      {...props}
    >
      <Icons.plus className="h-5 w-5" strokeWidth={2.5} />
      <span className="hidden lg:inline">Create Post</span>
    </Button>
  );
});

CreatePostButton.displayName = "CreatePostButton";

export default CreatePostButton;
