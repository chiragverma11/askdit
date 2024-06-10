import BackButton from "@/components/BackButton";
import CreateCommunityForm from "@/components/CreateCommunityForm";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { FC } from "react";

export const metadata: Metadata = {
  title: "Create Community",
  description:
    "Start your own community on Askdit. Create a new space to discuss your interests, share knowledge, and connect with like-minded people.",
  openGraph: {
    title: "Create Community",
    description:
      "Start your own community on Askdit. Create a new space to discuss your interests, share knowledge, and connect with like-minded people.",
    url: absoluteUrl("/communities/create"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Community",
    description:
      "Start your own community on Askdit. Create a new space to discuss your interests, share knowledge, and connect with like-minded people.",
  },
};

interface CreateCommunityProps {}

const CreateCommunity: FC<CreateCommunityProps> = ({}) => {
  return (
    <MainContentWrapper>
      <FeedWrapper className="flex max-w-2xl flex-col justify-center gap-10 px-2 md:px-0">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <BackButton />
          Create a Community
        </h1>
        <div className="px-4">
          <CreateCommunityForm />
        </div>
      </FeedWrapper>
    </MainContentWrapper>
  );
};

export default CreateCommunity;
