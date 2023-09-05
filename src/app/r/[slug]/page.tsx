import AsideBar from "@/components/AsideBar";
import Post from "@/components/Post";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { buttonVariants } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { getAuthSession } from "@/lib/auth";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { db } from "@/lib/db";
import { cn, getDefaultCommunityBg } from "@/lib/utils";
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

async function getCommunity(communityName: string) {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: communityName,
    },
    include: {
      _count: {
        select: {
          subscribers: true,
        },
      },
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });

  return subreddit;
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

  const defaultProfileBg = getDefaultCommunityBg({
    communityName: community?.name,
  });

  return (
    <>
      <AsideBar />
      <div className="flex w-full flex-col items-center justify-center px-4 py-8 pt-4">
        <div className="relative w-full lg:w-[600px]">
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
              {/* {session?.user.id !== community.creatorId ? ( */}
              <SubscribeLeaveToggle
                isSubscribed={isSubscribed}
                subredditId={community?.id}
                subredditName={community?.name}
                session={session}
                className="lg:hidden"
                disabled={session?.user.id === community?.creatorId}
              />
              {/* ) : null} */}
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
          <div className="space-y-3 pb-16 lg:pb-0">
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
          <SideMenu
            isSubscribed={isSubscribed}
            session={session}
            community={community}
          />
        </div>
      </div>
    </>
  );
};

const SideMenu = ({
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
    <div className="absolute right-[-2rem] top-0 hidden justify-self-end xl:block">
      <div className="fixed flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
        <div className="flex w-56 flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">r/{community?.name}</p>
            <SubscribeLeaveToggle
              isSubscribed={isSubscribed}
              subredditId={community?.id}
              subredditName={community?.name}
              session={session}
              className="hidden lg:inline-flex"
              disabled={session?.user.id === community?.creatorId}
            />
          </div>
          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex w-full items-center justify-between">
              <p className="text-sm">Members</p>
              <p className="text-sm">{community._count.subscribers}</p>
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="text-sm">Created</p>
              <p className="text-sm">
                {new Date(community.createdAt).toDateString()}
              </p>
            </div>
            <Separator />
            <Link
              href={`/r/${community.name}/submit`}
              className={cn(buttonVariants(), "w-full text-white")}
            >
              Create a Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubredditPage;
