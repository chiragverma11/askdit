import { cn } from "@/lib/utils";
import { FC } from "react";

interface FeedWrapperProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
}

const FeedWrapper: FC<FeedWrapperProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("relative w-full md:max-w-[600px]", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default FeedWrapper;
