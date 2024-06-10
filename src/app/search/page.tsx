import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import SearchFeed from "@/components/search/SearchFeed";
import SearchFeedFallback from "@/components/search/SearchFeedFallback";
import SearchSideMenu from "@/components/search/SearchSideMenu";
import SearchTypeSelector from "@/components/search/SearchTypeSelector";
import { getAuthSession } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";
import { SearchTypeValidator } from "@/lib/validators/search";
import { Metadata } from "next";
import { FC, Suspense } from "react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const query = searchParams.q as string;
  const title = query ? `Search results for "${query}"` : "Search";

  return {
    title: title,
    openGraph: {
      title: title,
      url: absoluteUrl("/search"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
    },
  };
}

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
