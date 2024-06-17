"use client";

import { cn } from "@/lib/utils";
import { Subreddit, User } from "@prisma/client";
import { AccordionItem } from "@radix-ui/react-accordion";
import Link from "next/link";
import { FC } from "react";
import UserAvatar from "../UserAvatar";
import { Accordion, AccordionContent, AccordionTrigger } from "../ui/Accordion";
import { buttonVariants } from "../ui/Button";

interface Moderator extends Pick<User, "name" | "username" | "image"> {}

type CommunityInfo = Pick<
  Subreddit,
  "id" | "name" | "description" | "createdAt" | "creatorId" | "image"
> & { moderators: Moderator[] };

interface CommunityInfoMobileProps
  extends React.ComponentPropsWithoutRef<"div"> {
  communityInfo: CommunityInfo;
}

const CommunityInfoMobile: FC<CommunityInfoMobileProps> = ({
  communityInfo,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl px-4 pb-4 lg:hidden",
        className,
      )}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="aboutCommunity">
          <AccordionTrigger
            className={cn(
              buttonVariants({ size: "xs", variant: "outline" }),
              "max-w-fit rounded-3xl border border-default px-2 text-xs font-semibold ring-0 hover:no-underline",
            )}
          >
            <span>About</span>
          </AccordionTrigger>
          <AccordionContent className="pb-0 pt-4">
            <AboutCommunity communityInfo={communityInfo} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

interface AboutCommunityProps extends CommunityInfoMobileProps {}

const AboutCommunity: FC<AboutCommunityProps> = ({ communityInfo }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="px-4">
        <div className="flex w-full items-center justify-between">
          <p className="text-default/40">Created</p>
          <p>
            {new Date(communityInfo.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <CommunityModeratorsCard moderators={communityInfo.moderators} />
    </div>
  );
};

interface CommunityModeratorsCardProps
  extends Pick<CommunityInfo, "moderators"> {}

const CommunityModeratorsCard: FC<CommunityModeratorsCardProps> = ({
  moderators,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
      <div className="flex flex-col gap-4">
        <p className="font-bold text-subtle">Moderators</p>
        <div className="flex h-auto w-full flex-col gap-2 text-sm">
          {moderators.map((moderator) => (
            <Link
              href={`/u/${moderator.username}`}
              className="flex items-center gap-2"
              key={moderator.username}
            >
              <UserAvatar
                className="h-6 w-6"
                user={{ name: moderator.name, image: moderator.image }}
              />
              <div className="flex flex-col">
                <span className="text-sm hover:underline">
                  u/{moderator.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityInfoMobile;
