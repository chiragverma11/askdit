import CloseModal from "@/components/CloseModal";
import Modal from "@/components/Modal";
import SignUp from "@/components/SignUp";

const SignUpModal = () => {
  return (
    <Modal>
      <div className="container mx-auto flex h-full max-w-lg items-center">
        <div className="relative h-max w-full rounded-2xl bg-subtle px-2 py-16">
          <div className="absolute right-4 top-4">
            <CloseModal />
          </div>

          <SignUp />
        </div>
      </div>
    </Modal>
  );
};

export default SignUpModal;
