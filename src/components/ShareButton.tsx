"use client";

import { FC } from "react";

import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { TbShare3 } from "react-icons/tb";
import { WebShare } from "./share/WebShare";

interface PostShareButtonProps extends React.ComponentPropsWithoutRef<"div"> {
  type: "post";
  post: {
    id: string;
    title: string;
    subredditName: string;
  };
}

interface CommentShareButtonProps
  extends React.ComponentPropsWithoutRef<"div"> {
  type: "comment";
  comment: {
    id: string;
    subredditName: string;
    postId: string;
  };
  level: number;
}

const ShareButton: FC<PostShareButtonProps | CommentShareButtonProps> = (
  props,
) => {
  const mounted = useMounted();
  const baseURL = mounted ? window.location.origin : "";

  const title =
    props.type === "post"
      ? props.post.title
      : mounted
        ? window.location.host
        : "";

  const url = mounted
    ? props.type === "post"
      ? new URL(`/r/${props.post.subredditName}/post/${props.post.id}`, baseURL)
      : new URL(
          `/r/${props.comment?.subredditName}/post/${
            props.comment?.postId
          }/comment/${props.comment?.id}${props.level > 1 ? "?context=3" : ""}`,
          baseURL,
        )
    : "";

  return (
    <WebShare
      data={{
        title: title,
        url: url.toString(),
      }}
      disableNative={true}
    >
      <span
        className={cn(
          "z-[1] inline-flex cursor-pointer items-center gap-1 rounded-3xl bg-subtle px-3 py-2 hover:bg-highlight/40 dark:hover:bg-highlight/60",
          props.type === "comment" ? "bg-transparent" : "",
        )}
      >
        <TbShare3 className="h-5 w-5" />
      </span>
    </WebShare>
  );
};

export default ShareButton;
