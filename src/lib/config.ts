export const COMMUNITY_NAME_REGEX = /^[a-zA-Z0-9_]{3,21}$/;

export const POST_TITLE_LENGTH = 300;

export const INFINITE_SCROLL_PAGINATION_RESULTS = 4;

export const INFINITE_SCROLL_COMMENT_RESULTS = 10;

export const MORE_COMMENT_REPLIES = 20;

export const COMMENT_REPLIES_DEPTH = 9;

export const IMAGEKIT_REGULAR_POST_UPLOAD_FOLDER =
  "/askdit/post/regular/images";

export const COMMUNITY_DESCRIPTION_LENGTH = 500;

export const URL_WITH_OPTIONAL_PROTOCOL_REGEX =
  /^(?:http(s)?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

export const APP_INFO: {
  author: { name: string; github: string };
  github: string;
} = {
  author: {
    name: "Chirag Verma",
    github: "https://github.com/chiragverma11",
  },
  github: "https://github.com/chiragverma11/askdit",
};
