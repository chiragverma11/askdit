import CommunityInfoCard from "@/components/CommunityInfoCard";
import CommunityModeratorsCard from "@/components/CommunityModeratorsCard";
import PostFeed from "@/components/PostFeed";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import UserAvatar from "@/components/UserAvatar";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import { getAuthSession } from "@/lib/auth";
import { getCommunity, getCreator, getSubscription } from "@/lib/prismaQueries";
import { cn, getDefaultCommunityBg } from "@/lib/utils";
import { Metadata } from "next";
import { Session } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface SubredditPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const communityName = params.slug;

  return { title: communityName };
}

const SubredditPage: FC<SubredditPageProps> = async ({ params }) => {
  const { slug } = params;

  const session = await getAuthSession();

  const community = await getCommunity(slug);

  const subscription = session
    ? await getSubscription({
        communityName: slug,
        userId: session?.user.id,
      })
    : null;

  const isSubscribed = !!subscription;

  const creator = community?.creatorId
    ? await getCreator({ creatorId: community.creatorId })
    : null;

  if (!community) return notFound();

  const initialPosts = community.posts;

  return (
    <MainContentWrapper>
      <FeedWrapper>
        <CommunityHeader
          isSubscribed={isSubscribed}
          session={session}
          community={community}
        />
        <PostFeed
          type="communityPost"
          initialPosts={initialPosts}
          communityName={slug}
          session={session}
        />
      </FeedWrapper>
      <SideMenuWrapper className="sticky top-[72px] h-fit justify-start">
        <CommunityInfoCard
          isSubscribed={isSubscribed}
          session={session}
          communityInfo={{
            id: community.id,
            name: community.name,
            image: community.image,
            description: community.description,
            subscribersCount: community._count.subscribers,
            creatorId: community.creatorId,
            createdAt: community.createdAt,
          }}
          parent="community"
        />
        <CommunityModeratorsCard moderator={creator?.username || null} />
      </SideMenuWrapper>
    </MainContentWrapper>
  );
};

const CommunityHeader = ({
  isSubscribed,
  session,
  community,
}: {
  isSubscribed: boolean;
  session: Session | null;
  community: Awaited<ReturnType<typeof getCommunity>>;
}) => {
  if (!community) return null;

  const defaultProfileBg = getDefaultCommunityBg({
    communityName: community?.name,
  });

  return (
    <div className="mb-3 flex w-full flex-col justify-between gap-4 px-4 lg:mb-4 lg:flex-row lg:items-center">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          {community.image ? (
            <UserAvatar
              className="h-12 w-12"
              user={{ name: community.name, image: community.image }}
            />
          ) : (
            <span
              className={cn(
                "flex aspect-square h-12 w-12 items-center justify-center rounded-full text-2xl font-bold text-zinc-950",
                defaultProfileBg,
              )}
            >
              r/
            </span>
          )}
          <div className="flex flex-col">
            <h1 className="text-lg font-bold lg:text-2xl">
              r/{community.name}
            </h1>

            <p className="text-xs text-subtle lg:hidden">
              {community._count.subscribers}{" "}
              {community._count.subscribers > 1 ? "members" : "member"}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <SubscribeLeaveToggle
            isSubscribed={isSubscribed}
            subredditId={community?.id}
            subredditName={community?.name}
            session={session}
            className="w-20 rounded-full"
            disabled={session?.user.id === community?.creatorId}
          />
        </div>
      </div>
      {community.description ? (
        <div className="texts text-sm lg:hidden">{community.description}</div>
      ) : null}
    </div>
  );
};

export default SubredditPage;
