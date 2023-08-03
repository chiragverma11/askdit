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
      className="h-6 w-6 rounded-md p-0"
      onClick={() => router.back()}
    >
      <X aria-label="Close" className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
