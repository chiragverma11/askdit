import InfoSideMenu from "@/components/InfoSideMenu";
import PostFeed from "@/components/PostFeed";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCommunity } from "@/lib/prismaQueries";
import { cn, getDefaultCommunityBg } from "@/lib/utils";
import { Metadata } from "next";
import { Session } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";
import { MdOutlinePostAdd } from "react-icons/md";

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

const getSubscription = async ({
  communityName,
  userId,
}: {
  communityName: string;
  userId: string;
}) => {
  const subscription = await db.subscription.findFirst({
    where: {
      Subreddit: { name: communityName },
      user: {
        id: userId,
      },
    },
  });

  return subscription;
};

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

  if (!community) return notFound();

  const initialPosts = community.posts;

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center py-8 pt-4 lg:px-4">
        <div className="relative w-full md:max-w-xl lg:w-[600px]">
          <CommunityInfo
            isSubscribed={isSubscribed}
            session={session}
            community={community}
          />
          <PostFeed
            initialPosts={initialPosts}
            communityName={slug}
            session={session}
          />
          <InfoSideMenu
            isSubscribed={isSubscribed}
            session={session}
            community={community}
          />
        </div>
      </div>
    </>
  );
};

const CommunityInfo = ({
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
    <div className="mb-3 flex w-full flex-col justify-between gap-4 lg:mb-4 lg:flex-row">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex aspect-square h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-zinc-950",
              defaultProfileBg,
            )}
          >
            r/
          </span>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold md:text-xl">
              r/{community.name}
            </h1>
            <p className="text-xs text-subtle lg:hidden">
              {community._count.subscribers}{" "}
              {community._count.subscribers > 1 ? "members" : "member"}
            </p>
          </div>
        </div>
        <SubscribeLeaveToggle
          isSubscribed={isSubscribed}
          subredditId={community?.id}
          subredditName={community?.name}
          session={session}
          className="lg:hidden"
          disabled={session?.user.id === community?.creatorId}
        />
      </div>

      {session?.user ? (
        <Link
          href={`/r/${community.name}/submit`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "flex w-fit items-center rounded-3xl border-2 border-transparent font-semibold hover:border-default/50 hover:bg-transparent",
          )}
        >
          <MdOutlinePostAdd className="mr-2 h-6 w-6" />
          Create a Post
        </Link>
      ) : null}
    </div>
  );
};

export default SubredditPage;
