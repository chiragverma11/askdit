import { z } from "zod";
import {
  DISPLAY_NAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_NAME_REGEX,
} from "../config";

export const getUsernameStatusValidator = z.object({
  username: z
    .string()
    .regex(USERNAME_NAME_REGEX, {
      message:
        "Username can only contain letters, numbers, underscores and dots.",
    })
    .toLowerCase()
    .min(2, {
      message: "Username can not be less than 2 characters.",
    })
    .max(USERNAME_MAX_LENGTH, {
      message: `Username can not be greater than ${USERNAME_MAX_LENGTH} characters.`,
    }),
});

export const updateProfileValidator = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name can not be empty.",
    })
    .max(DISPLAY_NAME_MAX_LENGTH, {
      message: `Name can not be greator than ${DISPLAY_NAME_MAX_LENGTH} characters.`,
    })
    .optional(),
  username: z
    .string()
    .regex(USERNAME_NAME_REGEX, {
      message:
        "Username can only contain letters, numbers, underscores and dots.",
    })
    .toLowerCase()
    .min(2, {
      message: "Username can not be less than 2 characters.",
    })
    .max(USERNAME_MAX_LENGTH, {
      message: `Username can not be greater than ${USERNAME_MAX_LENGTH} characters.`,
    })
    .optional(),
});
