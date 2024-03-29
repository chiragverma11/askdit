import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import SearchFeed from "@/components/search/SearchFeed";
import SearchFeedFallback from "@/components/search/SearchFeedFallback";
import SearchSideMenu from "@/components/search/SearchSideMenu";
import SearchTypeSelector from "@/components/search/SearchTypeSelector";
import { getAuthSession } from "@/lib/auth";
import { SearchTypeValidator } from "@/lib/validators/search";
import { FC, Suspense } from "react";

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SearchPage: FC<SearchPageProps> = async ({ searchParams }) => {
  const query = searchParams.q as string;
  const type = SearchTypeValidator.parse(searchParams.type);

  const session = await getAuthSession();

  return (
    <MainContentWrapper>
      <FeedWrapper>
        <SearchTypeSelector query={query} type={type} />
        <Suspense fallback={<SearchFeedFallback type={type} />}>
          <SearchFeed type={type} query={query} userId={session?.user.id} />
        </Suspense>
      </FeedWrapper>
      <SideMenuWrapper className="sticky top-[72px] h-fit justify-start">
        <SearchSideMenu type={type} session={session} query={query} />
      </SideMenuWrapper>
    </MainContentWrapper>
  );
};

export default SearchPage;
