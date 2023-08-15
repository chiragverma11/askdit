import CloseModal from "@/components/CloseModal";
import Modal from "@/components/Modal";
import SignIn from "@/components/SignIn";

const page = () => {
  return (
    <Modal>
      <div className="container mx-auto flex h-full max-w-lg items-center">
        <div className="relative h-fit w-full rounded-2xl border border-default/40 bg-subtle px-2 py-20">
          <div className="absolute right-4 top-4">
            <CloseModal />
          </div>

          <SignIn />
        </div>
      </div>
    </Modal>
  );
};

export default page;
