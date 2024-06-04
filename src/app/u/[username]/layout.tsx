import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import UserFeedFilterOptions from "@/components/user/UserFeedFilterOptions";
import UserFeedSelector from "@/components/user/UserFeedSelector";
import UserInfoCard from "@/components/user/UserInfoCard";
import UserInfoMobile from "@/components/user/UserInfoMobile";
import UserModeratorsCard, {
  UserModeratorCardSkeleton,
} from "@/components/user/UserModeratorCard";
import UserNotFound from "@/components/user/UserNotFound";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserInfo } from "@/lib/prismaQueries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface UserLayoutProps {
  children: React.ReactNode;
  params: {
    username: string;
  };
}

export async function generateMetadata({
  params,
}: UserLayoutProps): Promise<Metadata> {
  const username = params.username;

  const user = await db.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: {
      name: true,
    },
  });

  if (!user) {
    return {
      title: "User not found",
    };
  }

  return {
    title: `${user.name} (u/${username})`,
  };
}

export default async function UserLayout({
  children,
  params,
}: UserLayoutProps) {
  const username = params.username;
  const userInfo = await getUserInfo({ username });

  if (!userInfo) {
    return <UserNotFound />;
  }

  // Redirect if username's case in params is not same as in db
  if (username !== userInfo.username) {
    redirect(`/u/${userInfo.username}`);
  }

  const session = await getAuthSession();

  return (
    <MainContentWrapper>
      <FeedWrapper>
        <UserInfoMobile session={session} userInfo={{ ...userInfo }} />
        <UserFeedSelector
          isUserSelf={session?.user.id === userInfo?.id}
          username={username}
        />
        <UserFeedFilterOptions />
        {children}
      </FeedWrapper>
      <SideMenuWrapper className="sticky top-[72px] h-fit justify-start">
        <UserInfoCard session={session} userInfo={{ ...userInfo }} />
        <Suspense
          fallback={
            <UserModeratorCardSkeleton
              isUserSelf={session?.user.id === userInfo.id}
            />
          }
        >
          <UserModeratorsCard userId={userInfo?.id} session={session} />
        </Suspense>
      </SideMenuWrapper>
    </MainContentWrapper>
  );
}
