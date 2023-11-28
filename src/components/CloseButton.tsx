"use client";

import { X } from "lucide-react";
import { ComponentPropsWithoutRef, FC } from "react";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CloseButtonProps extends ComponentPropsWithoutRef<typeof Button> {}

const CloseButton: FC<CloseButtonProps> = ({
  variant = "ghost",
  className,
  ...props
}) => {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      className={cn("h-8 w-8 rounded-md p-0", className)}
      onClick={() => router.back()}
      {...props}
    >
      <X aria-label="Close" className="h-5 w-5 text-default" />
    </Button>
  );
};

export default CloseButton;
