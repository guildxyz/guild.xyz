import { z } from "zod"
export const profileSchema = z.object({
  name: z
    .string()
    .max(100, { message: "Name cannot exceed 100 characters" })
    .optional(),
  username: z
    .string()
    .min(1, { message: "Handle is required" })
    .max(100, { message: "Handle cannot exceed 100 characters" })
    .superRefine((value, ctx) => {
      const pattern = /^[\w\-.]+$/
      const isValid = pattern.test(value)
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Handle must only contain either alphanumeric, hyphen, underscore or dot characters",
        })
      }
    }),
  bio: z
    .string()
    .max(1000, { message: "Bio cannot exceed 500 characters" })
    .optional(),
  profileImageUrl: z
    .string()
    .url({ message: "Profile image must be a valid URL" })
    .max(500, { message: "Profile image URL cannot exceed 500 characters" })
    .optional(),
  backgroundImageUrl: z
    .string()
    .url({ message: "Background image must be a valid URL" })
    .max(500, { message: "Profile image URL cannot exceed 500 characters" })
    .optional(),
})
