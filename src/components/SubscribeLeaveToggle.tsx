"use client";

import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React, { FC, useState, useTransition } from "react";
import AuthLink from "./AuthLink";
import { Button, buttonVariants } from "./ui/Button";
import { useToast } from "@/hooks/use-toast";

interface SubscribeLeaveToggleProps extends React.HTMLAttributes<HTMLElement> {
  isSubscribed: boolean;
  subredditId: string;
  subredditName: string;
  session: Session | null;
  disabled?: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  isSubscribed,
  subredditId,
  subredditName,
  session,
  className,
  disabled = false,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast, dismiss } = useToast();
  const [isSub, setIsSub] = useState<boolean>(isSubscribed);

  const { mutate: subscribe, isLoading: isSubLoading } =
    trpc.community.subscribe.useMutation({
      onSuccess: () => {
        toast({ description: `Successfully joined r/${subredditName}` });
        startTransition(() => {
          router.refresh();
        });
      },
      onError() {
        setIsSub(false);
      },
    });

  const { mutate: unsubscribe, isLoading: isUnsubLoading } =
    trpc.community.unsubscribe.useMutation({
      onSuccess: () => {
        toast({ description: `Successfully left r/${subredditName}` });
        startTransition(() => {
          router.refresh();
        });
      },
      onError() {
        setIsSub(true);
      },
    });

  return isSub ? (
    <Button
      size={"xs"}
      variant={"outline"}
      className={cn(
        "min-w-max max-w-xs rounded-lg border-primary px-3 after:w-12 after:transition after:content-['Joined'] hover:after:content-['Leave']",
        className,
      )}
      onClick={() => {
        setIsSub(false);
        unsubscribe({ communityId: subredditId });
      }}
      disabled={disabled}
    />
  ) : session ? (
    <Button
      size={"xs"}
      className={cn("rounded-lg px-3", className)}
      onClick={() => {
        setIsSub(true);
        subscribe({ communityId: subredditId });
      }}
      disabled={disabled}
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
