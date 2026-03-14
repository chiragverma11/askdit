import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";
import { FC } from "react";
import { buttonVariants } from "./ui/Button";

const NoContent: FC<React.ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 px-2 py-4 text-center",
        className,
      )}
      {...props}
    />
  );
};

const NoContentTitle = React.forwardRef<
  React.ElementRef<"p">,
  React.ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
NoContentTitle.displayName = "NoContentTitle";

const NoContentDescription = React.forwardRef<
  React.ElementRef<"p">,
  React.ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
NoContentDescription.displayName = "NoContentDescription";

const NoContentAction = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    asChild?: boolean;
  } & VariantProps<typeof buttonVariants>
>(
  (
    {
      asChild,
      className,
      children,
      variant = "outline",
      size = "sm",
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : Link;

    return (
      <Component
        className={cn("w-fit", buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

NoContentAction.displayName = "NoContentAction";

export { NoContent, NoContentAction, NoContentDescription, NoContentTitle };
