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
      className="h-8 w-8 rounded-md bg-emphasis p-0 hover:bg-default"
      onClick={() => router.back()}
    >
      <X aria-label="Close" className="h-5 w-5 text-white" />
    </Button>
  );
};

export default CloseModal;
