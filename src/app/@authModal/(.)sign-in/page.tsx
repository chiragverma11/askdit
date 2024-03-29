import CloseButton from "@/components/CloseButton";
import { Modal, ModalContent } from "@/components/ui/Modal";
import SignIn from "@/components/SignIn";

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
