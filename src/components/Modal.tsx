import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-20 bg-zinc-900/25 backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Modal;
