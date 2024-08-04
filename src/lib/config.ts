export const COMMUNITY_NAME_REGEX = /^[a-zA-Z0-9_]{3,21}$/;

export const USERNAME_NAME_REGEX = /^[a-zA-Z0-9_.]*$/;

export const USERNAME_MAX_LENGTH = 20;

export const DISPLAY_NAME_MAX_LENGTH = 30;

export const POST_TITLE_LENGTH = 300;

export const INFINITE_SCROLL_PAGINATION_RESULTS = 6;

export const INFINITE_SCROLL_COMMENT_RESULTS = 10;

export const COMMENT_MAX_REPLIES = 5;

export const COMMENT_MIN_REPLIES = 3;

export const MORE_COMMENT_REPLIES = 20;

export const COMMENT_REPLIES_DEPTH = 9;

export const COMMUNITIES_SEARCH_RESULT = 10;

export const IMAGEKIT_REGULAR_POST_UPLOAD_FOLDER =
  "/askdit/post/regular/images";

export const IMAGEKIT_MEDIA_POST_UPLOAD_FOLDER = "/askdit/post/media/images";

export const COMMUNITY_DESCRIPTION_LENGTH = 500;

export const URL_WITH_OPTIONAL_PROTOCOL_REGEX =
  /^(?:http(s)?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

export const DROPZONE_MAX_FILES = 10;

export const DROPZONE_MAX_FILE_SIZE_IN_BYTES = 4194304;

export const MEDIA_CAPTION_LENGTH = 180;

export const STORAGE_LIMIT_PER_USER = 125829120;

export const SEARCH_SUGGESTIONS_LIMIT = 4;

export const MAX_PROFILE_IMAGE_SIZE_IN_BYTES = 524288;

export const IMAGEKIT_COMMUNITY_PROFILE_UPLOAD_FOLDER =
  "/askdit/community/profile/images";

export const REDIS_CACHE_EXPIRATION_SECONDS = 60 * 15;

/**
 * Redis Cache Prefixes
 */

export const USER_CACHE_KEY_PREFIX = "user:";
