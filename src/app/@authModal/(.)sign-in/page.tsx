import CloseModal from "@/components/CloseModal";
import SignIn from "@/components/SignIn";

const page = () => {
  return (
    <div className="fixed inset-0 z-10 bg-zinc-900/25 backdrop-blur">
      <div className="container mx-auto flex h-full max-w-lg items-center">
        <div className="relative h-fit w-full rounded-2xl border border-default/40 bg-emphasis px-2 py-20">
          <div className="absolute right-4 top-4">
            <CloseModal />
          </div>

          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default page;
