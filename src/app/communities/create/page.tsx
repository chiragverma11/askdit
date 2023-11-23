import BackButton from "@/components/BackButton";
import CreateCommunityForm from "@/components/CreateCommunityForm";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { Metadata } from "next";
import { FC } from "react";

export const metadata: Metadata = {
  title: "Create Community",
};

interface CreateCommunityProps {}

const CreateCommunity: FC<CreateCommunityProps> = ({}) => {
  return (
    <MainContentWrapper>
      <div className="w-full max-w-2xl">
        <div className="container mx-auto flex flex-col justify-center gap-10">
          <div className="flex flex-col gap-6">
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              <BackButton />
              Create a Community
            </h1>
          </div>
          <CreateCommunityForm />
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default CreateCommunity;
