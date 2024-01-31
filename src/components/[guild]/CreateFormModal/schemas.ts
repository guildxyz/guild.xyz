import { z } from "zod"

/**
 * TODO: we should delete this file and use the types/schemas from our types package
 * instead
 *
 * TODO: we could also define custom error messages instead the generic ones, like
 * "String must contain at least 1 character(s)"
 */

const FieldBaseSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(1),
  isRequired: z.boolean().optional().default(false),
})

const TextAndNumberFieldSchema = FieldBaseSchema.extend({
  type: z.enum(["SHORT_TEXT", "LONG_TEXT", "NUMBER"]),
})

const OptionsSchema = z.object({
  options: z.array(
    z
      .object({
        value: z.string().or(z.number()),
      })
      .transform((item) =>
        typeof item === "string" || typeof item === "number" ? item : item.value
      )
  ),
})

const SingleAndMultipleChoiceFieldSchema = FieldBaseSchema.merge(
  OptionsSchema
).extend({
  type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]),
  allowOther: z.boolean().optional().default(false),
})

const RateFieldSchema = FieldBaseSchema.merge(OptionsSchema).extend({
  type: z.enum(["RATE"]),
  worstLabel: z.string().optional(),
  bestLabel: z.string().optional(),
})

const FieldSchema = z.discriminatedUnion("type", [
  TextAndNumberFieldSchema,
  SingleAndMultipleChoiceFieldSchema,
  RateFieldSchema,
])

const FieldFromDBSchema = FieldSchema.and(
  z.object({
    id: z.string().uuid().optional(),
  })
)

export const FormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(FieldSchema),
  active: z.boolean().optional(),
})

const FormFromDBSchema = FormSchema.extend({
  id: z.number(),
  creatorUserId: z.number(),
  guildId: z.number(),
  fields: z.array(FieldSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Frontend formokban ezeket lehet használni
export type CreateFieldParams = z.input<typeof FieldSchema>
export type CreateFormParams = z.input<typeof FormSchema>
// Core így adja vissza DB-ből kiolvasott dolgokat (a DB query-k eredményét át lehet tolni a megfelelő sémákon és onnantól jók lesznek a typeok is mindenhol)
export type Field = z.infer<typeof FieldFromDBSchema>
export type Form = z.infer<typeof FormFromDBSchema>
