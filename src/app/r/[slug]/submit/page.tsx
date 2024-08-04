import BackButton from "@/components/BackButton";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SubmitPost from "@/components/submit/SubmitPost";
import { getCommunityInfo, getCommunityMetadata } from "@/lib/prismaQueries";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FC } from "react";

interface CreatePostSubredditProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params,
}: CreatePostSubredditProps): Promise<Metadata> {
  const communityName = params.slug;

  const community = await getCommunityMetadata({ name: communityName });

  if (!community) {
    return {
      title: "Community not found",
    };
  }

  return {
    title: { absolute: `Submit to r/${community.name}` },
    description: `Create a post in r/${community.name} on Askdit.`,
    openGraph: {
      title: { absolute: `Submit to r/${community.name}` },
      description: `Create a post in r/${community.name} on Askdit.`,
      url: absoluteUrl(`/r/${community.name}/submit`),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: { absolute: `Submit to r/${community.name}` },
      description: `Create a post in r/${community.name} on Askdit.`,
    },
  };
}

const CreatePostSubreddit: FC<CreatePostSubredditProps> = async ({
  params,
  searchParams,
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
        <SubmitPost community={community} searchParams={searchParams} />
      </FeedWrapper>
    </MainContentWrapper>
  );
};

export default CreatePostSubreddit;
