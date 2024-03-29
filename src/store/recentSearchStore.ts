import { FeedViewType } from "@/types/utilities";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentSearchType = "text" | "community" | "user";

interface CommonSearchProps {
  id: string;
  searchQuery: string;
  isTypeaheadSuggestion: boolean;
  createdAt: Date;
}

interface CommunityOrUserCommonProps extends CommonSearchProps {
  displayInfo: {
    iconUrl: string | null;
    name: string;
  };
}

// Specific type for when the type is 'text'
interface AddTextTypeRecentSearch
  extends Pick<CommonSearchProps, "searchQuery"> {
  type: "text";
}

// Specific type for when the type is not 'text'
interface AddNonTextTypeRecentSearch
  extends Pick<CommonSearchProps, "searchQuery"> {
  type: Exclude<RecentSearchType, "text">;
  displayInfo: Pick<CommunityOrUserCommonProps, "displayInfo">["displayInfo"];
}

type AddRecentSearchProps =
  | AddTextTypeRecentSearch
  | AddNonTextTypeRecentSearch;

interface TextSearchProps extends CommonSearchProps {
  type: "text";
}

interface CommunitySearchProps extends CommunityOrUserCommonProps {
  type: "community";
}

interface UserSearchProps extends CommunityOrUserCommonProps {
  type: "user";
}

export type RecentSearch =
  | TextSearchProps
  | CommunitySearchProps
  | UserSearchProps;

interface RecentSearchState {
  recentSearches: RecentSearch[];
}

interface RecentSearchActions {
  addRecentSearch: (props: AddRecentSearchProps) => void;
  removeRecentSearch: ({ id }: { id: string }) => void;
  clearRecentSearches: () => void;
}

export const useRecentSearchStore = create<
  RecentSearchState & RecentSearchActions
>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addRecentSearch: (props) => {
        // Check if the search query is already in the recent searches array
        const queryInRecentSearchIndex = get().recentSearches.findIndex(
          (recentSearch) => {
            if (recentSearch.type === props.type) {
              if (recentSearch.type === "text") {
                return recentSearch.searchQuery === props.searchQuery;
              } else if (props.type === "community" || props.type === "user") {
                return recentSearch.displayInfo.name === props.displayInfo.name;
              }
            }
          },
        );

        // If the search query is already in the recent searches array, update the createdAt property
        if (queryInRecentSearchIndex !== -1) {
          const updatedRecentSearch =
            get().recentSearches[queryInRecentSearchIndex];

          updatedRecentSearch.createdAt = new Date();

          return set((state) => ({
            recentSearches: [
              updatedRecentSearch,
              ...state.recentSearches
                .filter((_, index) => index !== queryInRecentSearchIndex)
                .slice(0, 4),
            ],
          }));
        }

        // If the search query is not in the recent searches array, add it to the recent searches array

        let newSearch: RecentSearch = {} as RecentSearch;

        if (props.type === "text") {
          newSearch = {
            id: nanoid(),
            searchQuery: props.searchQuery,
            isTypeaheadSuggestion: false,
            createdAt: new Date(),
            type: "text",
          };
        } else if (props.type === "community") {
          newSearch = {
            id: nanoid(),
            searchQuery: props.searchQuery,
            isTypeaheadSuggestion: false,
            createdAt: new Date(),
            type: "community",
            displayInfo: props.displayInfo,
          };
        } else if (props.type === "user") {
          newSearch = {
            id: nanoid(),
            searchQuery: props.searchQuery,
            isTypeaheadSuggestion: false,
            createdAt: new Date(),
            type: "user",
            displayInfo: props.displayInfo,
          };
        }

        return set((state) => ({
          recentSearches: [newSearch, ...state.recentSearches.slice(0, 4)],
        }));
      },
      removeRecentSearch: (searchToRemove) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter(
            (search) => search.id !== searchToRemove.id,
          ),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: "recent-search" },
  ),
);
