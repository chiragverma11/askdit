import { cn } from "@/lib/utils";
import { FC } from "react";

interface MainContentWrapperProps
  extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
}

const MainContentWrapper: FC<MainContentWrapperProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex w-full justify-center gap-4 pt-2 lg:max-w-[980px] lg:justify-between lg:px-4 lg:pt-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default MainContentWrapper;
