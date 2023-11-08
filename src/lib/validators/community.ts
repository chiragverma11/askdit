import { z } from "zod";
import { COMMUNITY_DESCRIPTION_LENGTH } from "../config";

export const DescriptionValidator = z.object({
  communityId: z.string(),
  description: z
    .string()
    .max(COMMUNITY_DESCRIPTION_LENGTH, {
      message: `Description must be less than ${COMMUNITY_DESCRIPTION_LENGTH} characters long`,
    }),
});
