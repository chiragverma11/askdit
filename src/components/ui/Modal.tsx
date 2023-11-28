import { cn } from "@/lib/utils";
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

export default Modal;
