"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/Button";

interface BackButtonProps extends React.ComponentProps<typeof Button> {}

const BackButton: FC<BackButtonProps> = ({ className, ...props }) => {
  const router = useRouter();
  return (
    <Button
      className={cn(
        "aspect-square h-8 w-8 rounded-md hover:bg-emphasis/40 dark:hover:bg-highlight/50",
        className,
      )}
      variant={"ghost"}
      size={"icon"}
      onClick={() => {
        router.back();
      }}
      {...props}
    >
      <Icons.backArrow className="h-5 w-5" />
    </Button>
  );
};

export default BackButton;
