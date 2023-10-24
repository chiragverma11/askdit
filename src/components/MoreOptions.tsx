"use client";

import { toast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  BookmarkMinus,
  BookmarkPlus,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

interface MoreOptionsProps {
  type: "post" | "comment";
  id: string;
  bookmark: boolean;
  isAuthor: boolean;
  redirectUrl: string;
  pathName: string;
}

const MoreOptions: FC<MoreOptionsProps> = ({
  type,
  id,
  bookmark,
  isAuthor,
  redirectUrl,
  pathName,
}) => {
  const router = useRouter();

  const utils = trpc.useUtils();

  const { mutate: deletePost } = trpc.post.delete.useMutation({
    onSuccess: () => {
      toast({ description: "Post deleted successfully" });
      if (pathName === redirectUrl) {
        return utils.post.infiniteCommunityPosts.invalidate();
      }
      router.push(redirectUrl);
    },
  });

  const { mutate: deleteComment } = trpc.comment.delete.useMutation({
    onSuccess: () => {
      toast({ description: "Comment deleted successfully" });
      if (pathName === redirectUrl) {
        return utils.comment.infiniteComments.invalidate();
      }
      router.push(redirectUrl);
    },
  });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <span
          className={cn(
            "z-[1] inline-flex cursor-pointer items-center gap-1 rounded-3xl bg-subtle px-3 py-2 text-zinc-400 hover:bg-highlight/60",
            type === "comment" ? "bg-transparent" : "",
          )}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <MoreHorizontal className="h-5 w-5" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="border-default/40 bg-emphasis dark:bg-subtle"
      >
        <DropdownMenuItem className="cursor-pointer" asChild>
          <div>
            {bookmark ? (
              <BookmarkPlus className="mr-2 h-4 w-4" />
            ) : (
              <BookmarkMinus className="mr-2 h-4 w-4" />
            )}
            Bookmark
          </div>
        </DropdownMenuItem>
        {isAuthor ? (
          <DropdownMenuItem className="cursor-pointer" asChild>
            <div
              onClick={() =>
                type === "post"
                  ? deletePost({
                      postId: id,
                    })
                  : deleteComment({
                      commentId: id,
                    })
              }
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </div>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreOptions;
