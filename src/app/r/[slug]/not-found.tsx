import {
  NoContent,
  NoContentAction,
  NoContentDescription,
  NoContentTitle,
} from "@/components/NoContent";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <MainContentWrapper>
      <FeedWrapper>
        <NoContent className="h-[75vh]">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-7xl font-semibold sm:text-8xl">404</h1>
            <NoContentTitle className="leading-tight tracking-normal sm:text-xl">
              Sorry, there aren&apos;t any communities on Askdit with that name.
            </NoContentTitle>
            <NoContentDescription>
              This community may have been banned or the community name is
              incorrect.
            </NoContentDescription>
          </div>
          <div className="flex gap-4">
            <NoContentAction
              href="/communities/create"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Create Community
            </NoContentAction>
            <NoContentAction href="/" variant="default">
              Go Home
            </NoContentAction>
          </div>
        </NoContent>
      </FeedWrapper>
    </MainContentWrapper>
  );
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex flex-col justify-center gap-4 text-center">
        <h2 className="text-lg">
          Sorry, there aren’t any communities on Askdit with that name.
        </h2>
        <p className="text-sm">
          This community may have been banned or the community name is
          incorrect.
        </p>
        <div className="mx-auto mt-4 flex gap-4">
          <Link
            href="/communities/create"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "bg-emphasis hover:bg-subtle",
            )}
          >
            Create Community
          </Link>
          <Link href="/" className={cn(buttonVariants({ size: "sm" }))}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
