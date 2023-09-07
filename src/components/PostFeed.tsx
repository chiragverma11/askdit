import { FC } from "react";
import Post from "./Post";

interface PostFeedProps {}

const PostFeed: FC<PostFeedProps> = ({}) => {
  return (
    <div className="space-y-3 pb-16 lg:pb-0">
      <Post />
      <Post />
      <Post />
      <Post />
    </div>
  );
};

export default PostFeed;
