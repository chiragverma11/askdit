import SignIn from "@/components/SignIn";
import { Modal, ModalCloseButton, ModalContent } from "@/components/ui/Modal";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  openGraph: {
    title: "Sign in",
    url: absoluteUrl("/sign-in"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign in",
  },
};

const SignInModal = () => {
  return (
    <Modal>
      <ModalContent className="bg-gradient-to-br from-brand-default/15 from-10% to-40%">
        <ModalCloseButton />
        <SignIn />
      </ModalContent>
    </Modal>
  );
};

export default SignInModal;
