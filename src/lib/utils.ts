import { CommentVote, Vote } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import { enIN } from "date-fns/locale";
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

export function getVotesAmount({ votes }: { votes: (Vote | CommentVote)[] }) {
  const votesAmt = votes.reduce((acc, vote) => {
    if (vote.type === "UP") return acc + 1;
    if (vote.type === "DOWN") return acc - 1;
    return acc;
  }, 0);

  return votesAmt;
}

/**
 * To format distance in custom format
 * @see https://github.com/date-fns/date-fns/issues/1706
 */

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}} minute",
  xMinutes: "{{count}} minute",
  aboutXHours: "{{count}} hour",
  xHours: "{{count}} hour",
  xDays: "{{count}} day",
  aboutXWeeks: "{{count}} week",
  xWeeks: "{{count}} week",
  aboutXMonths: "{{count}} month",
  xMonths: "{{count}} month",
  aboutXYears: "{{count}} year",
  xYears: "{{count}} year",
  overXYears: "{{count}} year",
  almostXYears: "{{count}} year",
};

function formatDistance(token: string, count: number, options: any) {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  const greaterThanOne = count > 1 ? true : false;

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in " + result + (greaterThanOne ? "s" : "");
    } else {
      if (result === "just now") return result;
      return result + (greaterThanOne ? "s" : "") + " ago";
    }
  }

  return result;
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...enIN,
      formatDistance,
    },
  });
}

export const getUrlMetadata = async (url: string) => {
  try {
    return await urlMetadata(url);
  } catch (error) {
    return null;
  }
};

export const isImageAccessible = async (imageUrl: string) => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);

    const imageResponse = await fetch(imageUrl as string, {
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!imageResponse.ok) {
      throw new Error("Image not accessible");
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const getRelativeUrl = (url: string, imageUrl: string) => {
  if (!imageUrl) {
    return null;
  }
  if (isValidUrl(imageUrl)) {
    return imageUrl;
  }
  const { protocol, host } = new URL(url);
  const baseURL = `${protocol}//${host}`;
  return new URL(imageUrl, baseURL).toString();
};
