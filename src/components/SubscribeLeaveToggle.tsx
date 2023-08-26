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
  disableRefresh?: boolean;
  disabled?: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  isSubscribed,
  subredditId,
  subredditName,
  session,
  className,
  disableRefresh,
  disabled = false,
  ...props
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast, dismiss } = useToast();
  const [isSub, setIsSub] = useState<boolean>(isSubscribed);

  const { mutate: subscribe, isLoading: isSubLoading } =
    trpc.community.subscribe.useMutation({
      onSuccess: () => {
        toast({ description: `Successfully joined r/${subredditName}` });
        !disableRefresh &&
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
        !disableRefresh &&
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
      onClick={(e) => {
        e.preventDefault();
        setIsSub(false);
        unsubscribe({ communityId: subredditId });
      }}
      disabled={disabled}
      {...props}
    />
  ) : session ? (
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
