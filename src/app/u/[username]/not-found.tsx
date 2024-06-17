import {
  NoContent,
  NoContentAction,
  NoContentDescription,
  NoContentTitle,
} from "@/components/NoContent";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";

export default function NotFound() {
  return (
    <MainContentWrapper>
      <FeedWrapper>
        <NoContent className="h-[75vh]">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-7xl font-semibold sm:text-8xl">404</h1>
            <NoContentTitle className="leading-tight tracking-normal sm:text-xl">
              Sorry, nobody on Askdit goes by that username.
            </NoContentTitle>
            <NoContentDescription>
              The person may have been banned or the username is incorrect.
            </NoContentDescription>
          </div>
          <NoContentAction href="/">Take me home</NoContentAction>
        </NoContent>
      </FeedWrapper>
    </MainContentWrapper>
  );
}