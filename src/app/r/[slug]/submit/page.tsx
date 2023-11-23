import SubmitPost from "@/components/SubmitPost";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { db } from "@/lib/db";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { FC } from "react";

async function getCommunity({ name }: { name: string }) {
  const community = await db.subreddit.findFirst({
    where: { name },
  });

  return community;
}

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

  const community = await getCommunity({ name: slug });

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
  const community = await getCommunity({ name: params.slug });

  if (!community) return notFound();

  return (
    <MainContentWrapper>
      <FeedWrapper className="px-2 md:max-w-[680px] md:px-0">
          <SubmitPost communityId={community?.id} />
      </FeedWrapper>
    </MainContentWrapper>
  );
};

export default CreatePostSubreddit;
