"use client";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { FC, ReactNode } from "react";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[51] bg-background/80 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface ModalContentProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
}

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
        "relative h-max w-full grow rounded-2xl border border-border bg-emphasis px-2 py-16 dark:bg-default",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
};

export { Modal, ModalContent };
