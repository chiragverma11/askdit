import { Metadata } from "next";
import { FC } from "react";

import BackButton from "@/components/BackButton";
import SubmitPost from "@/components/SubmitPost";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";

export const metadata: Metadata = {
  title: "Submit to Askdit",
};

interface CreatePostPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const CreatePostPage: FC<CreatePostPageProps> = async ({ searchParams }) => {
  return (
    <MainContentWrapper>
      <FeedWrapper className="px-2 md:max-w-[680px] md:px-0">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <BackButton />
          Create a Post
        </h1>

        <SubmitPost community={undefined} searchParams={searchParams} />
      </FeedWrapper>
    </MainContentWrapper>
  );
};

export default CreatePostPage;
