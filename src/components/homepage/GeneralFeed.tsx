import { getGeneralFeedPosts } from "@/lib/prismaQueries";
import { Session } from "next-auth";
import { FC } from "react";
import {
  NoContent,
  NoContentAction,
  NoContentDescription,
  NoContentTitle,
} from "../NoContent";
import PostFeed from "../PostFeed";

interface GeneralFeedProps {
  session: Session | null;
}

const GeneralFeed: FC<GeneralFeedProps> = async ({ session }) => {
  const posts = await getGeneralFeedPosts();

  if (posts.length === 0) {
    return (
      <NoContent>
        <NoContentTitle>
          hmm... looks like there are no posts yet
        </NoContentTitle>
        <NoContentDescription>
          Create one and get this feed started
        </NoContentDescription>
        <NoContentAction href="/submit">Create Post</NoContentAction>
      </NoContent>
    );
  }

  return (
    <PostFeed
      type="generalPost"
      initialPosts={posts}
      userId={session?.user.id}
    />
  );
};

export default GeneralFeed;
