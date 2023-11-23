import { cn } from "@/lib/utils";
import { FC } from "react";

interface SideMenuWrapperProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
}

const SideMenuWrapper: FC<SideMenuWrapperProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative hidden grow-0 lg:flex lg:w-[30%] lg:flex-col lg:gap-4 xl:w-1/3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default SideMenuWrapper;
