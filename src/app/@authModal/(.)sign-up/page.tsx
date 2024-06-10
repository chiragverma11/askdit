import CloseButton from "@/components/CloseButton";
import SignUp from "@/components/SignUp";
import { Modal, ModalContent } from "@/components/ui/Modal";
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
      <div className="container flex h-full max-w-lg items-center px-6 lg:px-8">
        <ModalContent>
          <div className="absolute right-4 top-4">
            <CloseButton />
          </div>

          <SignUp />
        </ModalContent>
      </div>
    </Modal>
  );
};

export default SignUpModal;
