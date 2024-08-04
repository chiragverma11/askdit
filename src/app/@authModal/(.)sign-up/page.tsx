import SignUp from "@/components/SignUp";
import { Modal, ModalCloseButton, ModalContent } from "@/components/ui/Modal";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  openGraph: {
    title: "Sign up",
    url: absoluteUrl("/sign-up"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign up",
  },
};

const SignUpModal = () => {
  return (
    <Modal>
      <ModalContent className="bg-gradient-to-br from-brand-default/15 from-10% to-40%">
        <ModalCloseButton />
        <SignUp />
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
