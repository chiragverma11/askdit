import SubmitPost from "@/components/SubmitPost";
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
    <>
      <div className="flex w-full justify-center px-4 py-6 pt-4">
        <div className="flex w-full flex-col md:w-[680px]">
          <h3 className="text-lg font-semibold">Create a Post</h3>
          <SubmitPost communityId={community?.id} />
        </div>
      </div>
    </>
  );
};

export default CreatePostSubreddit;
