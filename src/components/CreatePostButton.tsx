"use client";

import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
        "flex items-center gap-1 bg-red-500 px-1 font-semibold text-white hover:bg-red-500/75 lg:px-4",
        className,
      )}
      size={"sm"}
      onClick={(e) => {
        console.log("post");
        router.push(communityName ? `/r/${communityName}/submit` : "/submit");
        if (onClick) {
          onClick(e);
        }
      }}
      ref={ref}
      {...props}
    >
      <Plus className="h-5 w-5" strokeWidth={2.5} />
      <span className="hidden lg:inline">Create Post</span>
    </Button>
  );
});

CreatePostButton.displayName = "CreatePostButton";

export default CreatePostButton;
