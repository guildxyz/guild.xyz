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
  options: z.array(z.string().or(z.number())),
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

export const FieldCreationPayloadSchema = z.discriminatedUnion("type", [
  TextAndNumberFieldSchema,
  SingleAndMultipleChoiceFieldSchema,
  RateFieldSchema,
])

export const FieldSchema = FieldCreationPayloadSchema.and(
  z.object({
    id: z.string().uuid().optional(),
  })
)

export const FormCreationPayloadSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(FieldCreationPayloadSchema),
})

export const FormSchema = FormCreationPayloadSchema.extend({
  id: z.number(),
  creatorUserId: z.number(),
  guildId: z.number(),
  fields: z.array(FieldCreationPayloadSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Frontend-specific
export const FormCreationFormSchema = z
  .any()
  .transform((value) => {
    if (Array.isArray(value.fields)) {
      value.fields = value.fields.map((field) => {
        if (!Array.isArray(field.options)) return field
        return {
          ...field,
          options: field.options.map((option) => {
            if (typeof option === "string" || typeof option === "number")
              return option
            return option.value
          }),
        }
      })
    }

    return value
  })
  .pipe(FormCreationPayloadSchema)

export type FormCreationPayload = z.input<typeof FormCreationPayloadSchema>
export type Field = z.input<typeof FieldSchema>
export type Form = z.input<typeof FormSchema>
