import { z } from "zod"

const nullToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => (value === null ? undefined : value), schema)

// todo: remove this file and just use the schema from our types package
export const profileSchema = z.object({
  name: nullToUndefined(
    z.string().max(100, { message: "Name cannot exceed 100 characters" }).optional()
  ),
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(100, { message: "Username cannot exceed 100 characters" })
    .superRefine((value, ctx) => {
      const pattern = /^[\w\-.]+$/
      const isValid = pattern.test(value)
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Username must only contain either alphanumeric, hyphen, underscore or dot characters",
        })
      }
    }),
  bio: nullToUndefined(
    z.string().max(1000, { message: "Bio cannot exceed 1000 characters" }).optional()
  ),
  profileImageUrl: nullToUndefined(
    z
      .string()
      .url({ message: "Profile image must be a valid URL" })
      .max(500, { message: "Profile image URL cannot exceed 500 characters" })
      .optional()
  ),
  backgroundImageUrl: nullToUndefined(
    z
      .string()
      .url({ message: "Background image must be a valid URL" })
      .max(500, { message: "Profile image URL cannot exceed 500 characters" })
      .optional()
      .or(z.string().startsWith("#"))
  ),
})
