import { schemas } from "@guildxyz/types"
import { z } from "zod"

export const FormCreationSchema = z
  .any()
  .transform((_value) => {
    const value = structuredClone(_value)
    if (Array.isArray(value.fields)) {
      value.fields = value.fields?.map((field) => {
        if (!Array.isArray(field.options)) return field
        return {
          ...field,
          options: field.options?.map((option) => {
            if (typeof option === "string" || typeof option === "number")
              return option
            return option.value
          }),
        }
      })
    }

    return value
  })
  .pipe(schemas.FormCreationPayloadSchema)
