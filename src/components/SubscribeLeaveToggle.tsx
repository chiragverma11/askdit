"use client";

import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React, { FC, useState, useTransition } from "react";
import { toast } from "sonner";
import AuthLink from "./AuthLink";
import { Button, buttonVariants } from "./ui/Button";

interface SubscribeLeaveToggleProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  isSubscribed: boolean;
  subredditId: string;
  subredditName: string;
  isAuthenticated: boolean;
  disableRefresh?: boolean;
  disabled?: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  isSubscribed,
  subredditId,
  subredditName,
  isAuthenticated,
  className,
  disableRefresh,
  disabled = false,
  ...props
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSub, setIsSub] = useState<boolean>(isSubscribed);

  const { mutate: subscribe, isLoading: isSubLoading } =
    trpc.community.subscribe.useMutation({
      onSuccess: () => {
        toast.success(`Successfully joined r/${subredditName}`);
        !disableRefresh &&
          startTransition(() => {
            router.refresh();
          });
      },
      onError(error) {
        setIsSub(false);
        toast.error(`Failed to join r/${subredditName}`, {
          description: error.message,
        });
      },
    });

  const { mutate: unsubscribe, isLoading: isUnsubLoading } =
    trpc.community.unsubscribe.useMutation({
      onSuccess: () => {
        toast.success(`Successfully left r/${subredditName}`);
        !disableRefresh &&
          startTransition(() => {
            router.refresh();
          });
      },
      onError(error) {
        setIsSub(true);
        toast.error(`Failed to leave r/${subredditName}`, {
          description: error.message,
        });
      },
    });

  return isSub ? (
    <Button
      size={"xs"}
      variant={"outline"}
      className={cn(
        "min-w-max max-w-xs rounded-lg border-primary px-3 after:w-12 after:transition after:content-['Joined'] hover:bg-transparent hover:after:content-['Leave']",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        setIsSub(false);
        unsubscribe({ communityId: subredditId });
      }}
      disabled={disabled}
      {...props}
    />
  ) : isAuthenticated ? (
    <Button
      size={"xs"}
      className={cn("rounded-lg px-3", className)}
      onClick={(e) => {
        e.preventDefault();
        setIsSub(true);
        subscribe({ communityId: subredditId });
      }}
      disabled={disabled}
      {...props}
    >
      Join
    </Button>
  ) : (
    <AuthLink
      className={cn(
        buttonVariants({ size: "xs" }),
        "rounded-lg px-3 lg:hidden",
        className,
      )}
      href="/sign-in"
    >
      Join
    </AuthLink>
  );
};

export default SubscribeLeaveToggle;
