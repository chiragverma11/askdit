import { cn } from "@/lib/utils";
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
  React.ComponentPropsWithoutRef<typeof Link> & { asChild?: boolean }
>(({ asChild, className, children, ...props }, ref) => {
  if (
    asChild &&
    React.isValidElement(children) &&
    React.Children.count(children) === 1
  ) {
    return React.cloneElement(children as React.ReactElement, {
      ref,
      className: cn(className, children.props.className),
      ...props,
    });
  }

  return (
    <Link
      className={cn(
        "w-fit",
        buttonVariants({ variant: "outline", size: "sm" }),
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Link>
  );
});

NoContentAction.displayName = "NoContentAction";

export { NoContent, NoContentAction, NoContentDescription, NoContentTitle };
