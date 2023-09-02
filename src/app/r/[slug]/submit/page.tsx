import AsideBar from "@/components/AsideBar";
import Editor from "@/components/Editor";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FC } from "react";

interface CreatePostSubredditProps {
  params: {
    slug: string;
  };
}

const CreatePostSubreddit: FC<CreatePostSubredditProps> = async ({
  params,
}) => {
  const community = await db.subreddit.findFirst({
    where: { name: params.slug },
  });

  if (!community) return notFound();

  return (
    <>
      <AsideBar />
      <div className="flex w-full justify-center px-4 py-6 pt-4">
        <div className="flex w-full flex-col lg:w-[680px]">
          <h3 className="text-lg font-semibold">Create a Post</h3>
          {/* <PostCommunitySelect /> */}
          <Editor communityId={community?.id} />
        </div>
      </div>
    </>
  );
};

export default CreatePostSubreddit;
