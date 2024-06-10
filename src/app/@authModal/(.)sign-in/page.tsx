import CloseButton from "@/components/CloseButton";
import SignIn from "@/components/SignIn";
import { Modal, ModalContent } from "@/components/ui/Modal";
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
      <div className="container flex h-full max-w-lg items-center px-6 lg:px-8">
        <ModalContent>
          <div className="absolute right-4 top-4">
            <CloseButton />
          </div>

          <SignIn />
        </ModalContent>
      </div>
    </Modal>
  );
};

export default SignInModal;
