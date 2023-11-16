import { getGeneralFeedPosts } from "@/lib/prismaQueries";
import { Session } from "next-auth";
import { FC } from "react";
import PostFeed from "../PostFeed";

interface GeneralFeedProps {
  session: Session | null;
}

const GeneralFeed: FC<GeneralFeedProps> = async ({ session }) => {
  const posts = await getGeneralFeedPosts();

  return <PostFeed initialPosts={posts} session={session} />;
};

export default GeneralFeed;
