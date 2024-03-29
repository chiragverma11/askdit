import { FeedViewType } from "@/types/utilities";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FeedViewState {
  feedViewType: FeedViewType;
  setFeedViewType: (newType: FeedViewType) => void;
}

export const useFeedViewStore = create<FeedViewState>()(
  persist(
    (set, get) => ({
      feedViewType: "card",
      setFeedViewType: (newType) => set({ feedViewType: newType }),
    }),
    { name: "feed-view" },
  ),
);
