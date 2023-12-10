import BackButton from "@/components/BackButton";
import SubmitPost from "@/components/SubmitPost";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { getCommunityInfo } from "@/lib/prismaQueries";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { FC } from "react";

interface CreatePostSubredditProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: CreatePostSubredditProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = params.slug;

  const community = await getCommunityInfo({ name: slug });

  if (!community) {
    return {
      title: "Community not found",
    };
  }

  return {
    title: `Submit to ${slug}`,
  };
}

const CreatePostSubreddit: FC<CreatePostSubredditProps> = async ({
  params,
}) => {
  const community = await getCommunityInfo({ name: params.slug });

  if (!community) return notFound();

  return (
    <MainContentWrapper>
      <FeedWrapper className="px-2 md:max-w-[680px] md:px-0">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <BackButton />
          Create a Post
        </h1>
        <SubmitPost communityId={community?.id} />
      </FeedWrapper>
    </MainContentWrapper>
  );
};

export default CreatePostSubreddit;
