import CommunityDescription from "@/components/CommunityDescription";
import CommunityInfoCard from "@/components/CommunityInfoCard";
import CommunityModeratorsCard from "@/components/CommunityModeratorsCard";
import FeedFilterOptions from "@/components/FeedFilterOptions";
import {
  NoContent,
  NoContentAction,
  NoContentDescription,
  NoContentTitle,
} from "@/components/NoContent";
import PostFeed from "@/components/PostFeed";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import CommunityImage from "@/components/community/CommunityImage";
import CommunityInfoMobile from "@/components/community/CommunityInfoMobile";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import { getAuthSession } from "@/lib/auth";
import {
  getCommunity,
  getCommunityMetadata,
  getCreator,
  getSubscription,
} from "@/lib/prismaQueries";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { Session } from "next-auth";
import { notFound, redirect } from "next/navigation";
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
  const community = await getCommunityMetadata({ name: communityName });

  if (!community) {
    return {
      title: "Community not found",
    };
  }

  return {
    title: { absolute: community.name },
    description: community.description,
    openGraph: {
      title: { absolute: community.name },
      description: community.description || undefined,
      url: absoluteUrl(`/r/${community.name}`),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: { absolute: community.name },
      description: community.description || undefined,
    },
  };
}

const SubredditPage: FC<SubredditPageProps> = async ({ params }) => {
  const { slug } = params;

  const session = await getAuthSession();

  const community = await getCommunity(slug, session?.user.id);

  const subscription = session
    ? await getSubscription({
        communityName: slug,
        userId: session?.user.id,
      })
    : null;

  const isSubscribed = !!subscription;

  if (!community) {
    return notFound();
  }

  const creator = community.creatorId
    ? await getCreator({ creatorId: community.creatorId })
    : null;

  // Redirect if communityName's case in params is not same as in db
  if (slug !== community.name) {
    redirect(`/r/${community.name}`);
  }

  const initialPosts = community.posts;

  return (
    <MainContentWrapper>
      <FeedWrapper>
        <CommunityHeader
          isSubscribed={isSubscribed}
          session={session}
          community={community}
        />
        <CommunityInfoMobile
          communityInfo={{
            id: community.id,
            name: community.name,
            image: community.image,
            description: community.description,
            creatorId: community.creatorId,
            createdAt: community.createdAt,
            moderators: creator?.username
              ? [
                  {
                    name: creator.name,
                    username: creator.username,
                    image: creator.image,
                  },
                ]
              : [],
          }}
        />
        <FeedFilterOptions />
        {initialPosts.length === 0 ? (
          <NoContent>
            <NoContentTitle>
              This community doesn&apos;t have any posts yet
            </NoContentTitle>
            <NoContentDescription>
              Make a post to get this feed started
            </NoContentDescription>
            <NoContentAction href={`/r/${community.name}/submit`}>
              Create Post
            </NoContentAction>
          </NoContent>
        ) : (
          <PostFeed
            type="communityPost"
            initialPosts={initialPosts}
            communityName={slug}
            userId={session?.user.id}
          />
        )}
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
        <CommunityModeratorsCard
          moderators={
            creator?.username
              ? [
                  {
                    name: creator.name,
                    username: creator.username,
                    image: creator.image,
                  },
                ]
              : []
          }
        />
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

  return (
    <div className="mb-3 flex w-full flex-col justify-between gap-4 px-4 lg:mb-4 lg:flex-row lg:items-center">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <CommunityImage community={community} session={session} />
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
            isAuthenticated={session ? true : false}
            className="w-20 rounded-full"
            disabled={session?.user.id === community?.creatorId}
          />
        </div>
      </div>
      {community.description ? (
        <div className="text-sm lg:hidden">
          <CommunityDescription
            initialDescription={community.description}
            communityId={community.id}
            isAuthor={session?.user.id === community.creatorId}
          />
        </div>
      ) : null}
    </div>
  );
};

export default SubredditPage;
