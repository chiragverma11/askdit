import { Vote } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDefaultCommunityBg({
  communityName,
}: {
  communityName: string;
}) {
  const firstChar = communityName?.charAt(0);
  return firstChar?.match(/[a-iA-I]/g)
    ? "bg-amber-400"
    : firstChar?.match(/[j-rJ-R]/g)
    ? "bg-lime-400"
    : firstChar?.match(/[s-zS-Z]/g)
    ? "bg-violet-400"
    : "";
}

export function getVotesAmount({ votes }: { votes: Vote[] }) {
  const votesAmt = votes.reduce((acc, vote) => {
    if (vote.type === "UP") return acc + 1;
    if (vote.type === "DOWN") return acc - 1;
    return acc;
  }, 0);

  return votesAmt;
}
