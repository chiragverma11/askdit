"use client";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { Icons } from "../Icons";
import { Button } from "./Button";

interface ModalProps extends React.ComponentPropsWithoutRef<"div"> {}

const Modal: FC<ModalProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[51] bg-background/50 px-6 backdrop-blur-sm dark:bg-background/65 lg:px-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface ModalContentProps extends React.ComponentPropsWithoutRef<"div"> {}

const ModalContent: FC<ModalContentProps> = ({
  className,
  children,
  ...props
}) => {
  const router = useRouter();
  const ref = useClickOutside(() => router.back());

  return (
    <div
      className={cn(
        "relative left-[50%] top-[50%] z-[51] h-max w-full max-w-md grow translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-border bg-emphasis px-2 py-16 shadow-lg dark:bg-default",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
};

interface ModalCloseButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {}

const ModalCloseButton: FC<ModalCloseButtonProps> = ({
  variant = "ghost",
  className,
  ...props
}) => {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      className={cn("absolute right-4 top-4 h-8 w-8 rounded-md p-0", className)}
      onClick={() => router.back()}
      {...props}
    >
      <Icons.close aria-label="Close" className="h-5 w-5 text-default" />
    </Button>
  );
};

export { Modal, ModalCloseButton, ModalContent };
