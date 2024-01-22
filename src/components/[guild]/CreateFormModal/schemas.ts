import { z } from "zod"

/**
 * TODO: we should delete this file and use the types/schemas from our types package
 * instead
 */

const FieldBaseSchema = z.object({
  question: z.string().min(1),
  isRequired: z.boolean().optional(),
})

const TextAndNumberFieldSchema = FieldBaseSchema.extend({
  type: z.enum(["SHORT_TEXT", "LONG_TEXT", "NUMBER"]),
})

const SingleAndMultipleChoiceFieldSchema = FieldBaseSchema.extend({
  type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]),
  options: z.array(z.string().or(z.number())),
  allowOther: z.boolean().optional(),
})

const RateFieldSchema = FieldBaseSchema.extend({
  type: z.enum(["RATE"]),
  options: z.array(z.string().or(z.number())),
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
    id: z.string().uuid(),
  })
)

export const FormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(FieldSchema),
  active: z.boolean().optional(),
})

const FormFromDBSchema = FormSchema.extend({
  creatorUserId: z.number(),
  guildId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Frontend formokban ezeket lehet használni
export type CreateFieldParams = z.infer<typeof FieldSchema>
export type CreateFormParams = z.infer<typeof FormSchema>
// Core így adja vissza DB-ből kiolvasott dolgokat (a DB query-k eredményét át lehet tolni a megfelelő sémákon és onnantól jók lesznek a typeok is mindenhol)
export type Field = z.infer<typeof FieldFromDBSchema>
export type Form = z.infer<typeof FormFromDBSchema>
