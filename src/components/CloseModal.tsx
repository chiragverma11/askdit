"use client";

import { X } from "lucide-react";
import { FC } from "react";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";

interface CloseModalProps {}

const CloseModal: FC<CloseModalProps> = ({}) => {
  const router = useRouter();
  return (
    <Button
      variant="subtle"
      className="h-8 w-8 rounded-md bg-zinc-300/70 p-0 hover:bg-zinc-300 dark:bg-emphasis dark:hover:bg-default"
      onClick={() => router.back()}
    >
      <X aria-label="Close" className="h-5 w-5 text-white" />
    </Button>
  );
};

export default CloseModal;
