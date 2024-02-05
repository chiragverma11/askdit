import { CommentVote, Prisma, Vote } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import { enIN } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import urlMetadata from "url-metadata";
import { COMMENT_MIN_REPLIES } from "./config";

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

export function getVotes({
  votes,
  currentUserId,
}: {
  votes: (Vote | CommentVote)[];
  currentUserId: string | undefined;
}) {
  const votesAmt = getVotesAmount({ votes });

  const currentVoteType = votes.find((vote) => vote.userId === currentUserId)
    ?.type;

  return { votesAmt, currentVoteType };
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

export const addProtocol = (url: string) => {
  const hasProtocol = /^http(s)?:\/\//;

  if (!hasProtocol.test(url)) {
    url = "http://" + url;
  }
  return url;
};

export const addResolutionToImageUrl = (
  url: string | undefined,
  width: number | undefined,
  height: number | undefined,
) => {
  return `${url}?width=${width}&height=${height}`;
};

type HierarchicalReplies = {
  take?: number | undefined;
  include: {
    author: boolean;
    votes: boolean;
    bookmarks: boolean | { where: { userId: string } };
    _count: { select: { replies: boolean } };
    replies: HierarchicalReplies;
  };
};

export const createHierarchicalRepliesInclude = ({
  level,
  take,
  userId,
}: {
  level: number;
  take?: number;
  userId?: string;
}): HierarchicalReplies => {
  if (level <= 0) {
    return undefined as unknown as HierarchicalReplies;
  }

  // Recursive case: create the replies object for the current level
  const replies: HierarchicalReplies = {
    take: take
      ? take >= COMMENT_MIN_REPLIES
        ? take
        : COMMENT_MIN_REPLIES
      : undefined,
    include: {
      author: true,
      votes: true,
      bookmarks: userId
        ? {
            where: {
              userId: userId,
            },
          }
        : false,
      _count: {
        select: {
          replies: true,
        },
      },
      replies: createHierarchicalRepliesInclude({
        level: level - 1,
        userId,
        take: take
          ? take >= COMMENT_MIN_REPLIES
            ? take - 1
            : COMMENT_MIN_REPLIES
          : undefined,
      }),
    },
  };

  return replies;
};

export const createHierarchicalCommentReplyToSelect = ({
  level,
}: {
  level: number;
}): Prisma.CommentSelect => {
  // Base case: if level is 0, return an empty replyTo object
  if (level < 0) {
    return {};
  }

  // Recursive case: create the replyTo object for the current level
  const select: Prisma.CommentSelect = {
    id: level === 0 ? true : false,
    replyTo:
      level !== 0
        ? {
            select: createHierarchicalCommentReplyToSelect({
              level: level - 1,
            }),
          }
        : false,
  };

  return select;
};

export const getTopContextParentCommentId = (
  comment: any,
): { parentCommentId: string | undefined; findOnContext: number } => {
  let currentComment = comment;
  let findOnContext = 0;

  while (currentComment && currentComment.replyTo) {
    currentComment = currentComment.replyTo;
    findOnContext++;
  }
  return {
    parentCommentId: currentComment ? currentComment.id : undefined,
    findOnContext,
  };
};
