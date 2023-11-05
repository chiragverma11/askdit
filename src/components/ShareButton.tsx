"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useToast } from "@/hooks/use-toast";
import { RouterOutputs } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useClipboard, useMediaQuery } from "@mantine/hooks";
import { Comment, Post, Subreddit, User, Vote } from "@prisma/client";
import { BookmarkPlus, Link as LinkIcon, Share2 } from "lucide-react";
import { useState } from "react";
import { TbShare3 } from "react-icons/tb";
import { RWebShare } from "react-web-share";
import { Drawer } from "vaul";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

type InfiniteCommunityPostsOutput =
  RouterOutputs["post"]["infiniteCommunityPosts"];

interface ShareButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  post?:
    | Pick<InfiniteCommunityPostsOutput, "posts">["posts"][number]
    | (Post & {
        author: User;
        votes: Vote[];
        subreddit: Subreddit;
        comments: Comment[];
      });
  comment?: {
    id: string;
    subredditName: string;
    postId: string;
  };
}

const ShareButton = ({ post, comment }: ShareButtonProps) => {
  const clipboard = useClipboard();
  const { toast } = useToast();
  const mounted = useMounted();
  const baseURL = mounted ? window.location.origin : "";
  const type = post ? "post" : "comment";

  const title = post ? post?.title : window.location.host;

  const url = mounted
    ? post
      ? new URL(`/r/${post?.subreddit.name}/post/${post?.id}`, baseURL)
      : new URL(
          `/r/${comment?.subredditName}/post/${comment?.postId}/`,
          baseURL,
        )
    : "";

  if (mounted && !post && url !== "") {
    url.searchParams.append("comment", `${comment?.id}`);
  }

  const isLg = useMediaQuery("(min-width: 1024px)");

  function onCopyLink() {
    clipboard.copy(url);
    if (!clipboard.error) {
      toast({ description: "Copied Link!" });
    }
  }
  if (!isLg) {
    return (
      <ShareButtonDrawer
        url={url as URL}
        onCopyLink={onCopyLink}
        title={title}
        type={type}
      />
    );
  }

  return (
    <ShareButtonDropdown
      url={url as URL}
      onCopyLink={onCopyLink}
      title={title}
      type={type}
    />
  );
};

interface ShareButtonMenuProps {
  url: URL;
  onCopyLink: () => void;
  title: string;
  type: "post" | "comment";
}

const ShareButtonDrawer = ({
  url,
  onCopyLink,
  title,
  type,
}: ShareButtonMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open === true) {
          document.body.style.pointerEvents = "none";
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.removeProperty("overflow");
          document.body.style.removeProperty("pointer-events");
        }
      }}
      modal={false}
    >
      <Drawer.Trigger asChild>
        <span
          className={cn(
            "z-[1] inline-flex cursor-pointer items-center gap-1 rounded-3xl bg-subtle px-3 py-2 hover:bg-highlight/40 dark:hover:bg-highlight/60",
            type === "comment" ? "bg-transparent" : "",
          )}
        >
          <TbShare3 className="h-5 w-5" />
          Share
        </span>
      </Drawer.Trigger>
      <Drawer.Portal>
        <div className="fixed inset-0 z-10 bg-zinc-700/40">
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-10 mt-24 flex flex-col rounded-t-2xl bg-emphasis dark:bg-default">
            <div className="flex-1 rounded-t-[10px] p-4">
              <div className="mx-auto mb-6 h-1.5 w-12 flex-shrink-0 rounded-full bg-highlight" />
              <div className="flex flex-col gap-5 pb-4 text-sm font-semibold text-default">
                <button
                  className="inline-flex items-center"
                  onClick={() => setOpen(false)}
                >
                  <BookmarkPlus className="mr-2 h-4 w-4" strokeWidth={2.125} />
                  Bookmark
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    onCopyLink();
                  }}
                  className="inline-flex items-center"
                >
                  <LinkIcon className="mr-2 h-4 w-4" strokeWidth={2.125} />
                  Copy Link
                </button>
                <div>
                  <RWebShare
                    data={{
                      title: title,
                      url: url.toString(),
                    }}
                    onClick={() => setOpen(false)}
                  >
                    <button className="inline-flex items-center">
                      <Share2 className="mr-2 h-4 w-4" strokeWidth={2.125} />
                      Share post via...
                    </button>
                  </RWebShare>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </div>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

const ShareButtonDropdown = ({
  url,
  onCopyLink,
  title,
  type,
}: ShareButtonMenuProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <span
          className={cn(
            "z-[1] inline-flex cursor-pointer items-center gap-1 rounded-3xl bg-subtle px-3 py-2 hover:bg-highlight/60",
            type === "comment" ? "bg-transparent" : "",
          )}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <TbShare3 className="h-5 w-5" />
          Share
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="border-default/40 bg-emphasis dark:bg-subtle"
      >
        <DropdownMenuItem className="cursor-pointer" asChild>
          <div onClick={onCopyLink}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Copy Link
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          asChild
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <RWebShare
              data={{
                title: title,
                url: url.toString(),
              }}
            >
              <button className="inline-flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share post via...
              </button>
            </RWebShare>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
