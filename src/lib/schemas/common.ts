import { z } from "zod";

export const NameSchema = z
  .string()
  .max(255, "Maximum name length is 255 characters");

export const ImageUrlSchema = z.string().url().max(255);

export const LogicSchema = z.enum(["AND", "OR", "ANY_OF"]);

export const DateLike = z.date().or(z.string().datetime());
