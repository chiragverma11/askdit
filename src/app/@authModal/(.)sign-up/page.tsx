import CloseButton from "@/components/CloseButton";
import SignUp from "@/components/SignUp";
import { Modal, ModalContent } from "@/components/ui/Modal";

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
