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
