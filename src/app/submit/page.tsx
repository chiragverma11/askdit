import { Metadata } from "next";
import { FC } from "react";

import BackButton from "@/components/BackButton";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SubmitPost from "@/components/submit/SubmitPost";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Submit to Askdit" },
  description: "Create a post on Askdit.",
  openGraph: {
    title: { absolute: "Submit to Askdit" },
    description: "Create a post on Askdit.",
    url: absoluteUrl("/submit"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: { absolute: "Submit to Askdit" },
    description: "Create a post on Askdit.",
  },
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
