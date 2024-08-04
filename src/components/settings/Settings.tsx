import { cn } from "@/lib/utils";
import React from "react";
import { Separator } from "../ui/Separator";

const Settings = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "space-y-1 pb-16 sm:space-y-2 md:space-y-3 lg:pb-0",
      className,
    )}
    {...props}
  />
));
Settings.displayName = "Settings";

const SettingsHeader = React.forwardRef<
  React.ElementRef<"h1">,
  React.ComponentPropsWithoutRef<"h1">
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn("mb-6 text-xl font-semibold", className)}
    {...props}
  />
));
SettingsHeader.displayName = "SettingsHeader";

const SettingsContent = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-4 text-sm", className)}
    {...props}
  />
));
SettingsContent.displayName = "SettingsContent";

const SettingsGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { groupName: string }
>(({ groupName, className, children, ...props }, ref) => (
  <>
    <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
      <h2 className="text-xs font-semibold uppercase text-subtle">
        {groupName}
      </h2>
      <Separator className="mb-4 bg-emphasis/90" />
      {children}
    </div>
  </>
));
SettingsGroup.displayName = "SettingsGroup";

const SettingsItem = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));

SettingsItem.displayName = "SettingsItem";

export {
  Settings,
  SettingsContent,
  SettingsGroup,
  SettingsHeader,
  SettingsItem,
};
