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
import { FC, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/AlertDialog";
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
  onCommentDelete?: () => void;
}

const MoreOptions: FC<MoreOptionsProps> = ({
  type,
  id,
  bookmark,
  isAuthor,
  redirectUrl,
  pathName,
  onCommentDelete,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(bookmark);

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
      if (onCommentDelete) {
        onCommentDelete();
      }
    },
  });

  const { mutate: bookmarkPost } = trpc.post.bookmark.useMutation({
    onSuccess: (data, variables, context) => {
      setIsBookmarked(!isBookmarked);
    },
  });

  const { mutate: bookmarkComment } = trpc.comment.bookmark.useMutation({
    onSuccess: (data, variables, context) => {
      setIsBookmarked(!isBookmarked);
    },
  });

  const handleBookmark = () => {
    type === "post"
      ? bookmarkPost(
          { postId: id, remove: isBookmarked },
          {
            onSuccess: () => {
              toast({
                description: isBookmarked
                  ? "Post unsaved successfully"
                  : "Post saved successfully",
              });
            },
          },
        )
      : bookmarkComment(
          { commentId: id, remove: isBookmarked },
          {
            onSuccess: () => {
              toast({
                description: isBookmarked
                  ? "Comment unsaved successfully"
                  : "Comment saved successfully",
              });
            },
          },
        );
  };

  const handleDeletion = () => {
    type === "post"
      ? deletePost({
          postId: id,
        })
      : deleteComment({
          commentId: id,
        });
  };

  const handleAlertDialogOpenChange = (open: boolean) => {
    if (open === false) {
      setDropdownOpen(false);
    }
  };

  return (
    <DropdownMenu
      modal={false}
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
    >
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
          <MoreHorizontal className="h-5 w-5" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        collisionPadding={4}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="border-default/40 bg-emphasis dark:bg-subtle"
      >
        <DropdownMenuItem className="flex cursor-pointer items-center" asChild>
          <div onClick={handleBookmark}>
            {isBookmarked ? (
              <BookmarkMinus className="mr-2 h-4 w-4" />
            ) : (
              <BookmarkPlus className="mr-2 h-4 w-4" />
            )}
            {isBookmarked ? "Unsave" : "Save "}
          </div>
        </DropdownMenuItem>
        {isAuthor ? (
          <ConfirmDeletionDialog
            type={type}
            handleDeletion={handleDeletion}
            onOpenChange={handleAlertDialogOpenChange}
          />
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ConfirmDeletionProps {
  type: "post" | "comment";
  handleDeletion: () => void;
  onOpenChange: (open: boolean) => void;
}

const ConfirmDeletionDialog: FC<ConfirmDeletionProps> = ({
  type,
  handleDeletion,
  onOpenChange,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <AlertDialog open={dialogOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger className="min-w-full" asChild>
        <DropdownMenuItem
          className="w-full cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            setDialogOpen(true);
          }}
        >
          <div className="flex min-w-full items-center">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </div>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[90vw] rounded-xl bg-emphasis dark:bg-default sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {type}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your{" "}
            {type === "post" ? "post? You can't undo this." : "comment?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleDeletion();
              setDialogOpen(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MoreOptions;
