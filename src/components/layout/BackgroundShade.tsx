import { cn } from "@/lib/utils";
import React, { FC } from "react";

interface BackgroundShadeProps extends React.HTMLAttributes<HTMLDivElement> {}

const BackgroundShade: FC<BackgroundShadeProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 h-full w-full bg-gradient-to-b from-brand-default/30 from-0% to-30% dark:from-brand-default/20",
        className,
      )}
    />
  );
};

export default BackgroundShade;
