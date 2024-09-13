import { FieldValues } from "react-hook-form"

export const filterOnDirtyFormFields = <T extends FieldValues>(
  allFields: T,
  dirtyFields: Partial<Record<keyof T, boolean>>
): Partial<T> => {
  const changedFieldValues = Object.keys(dirtyFields).reduce(
    (acc, currentField) => {
      return {
        ...acc,
        [currentField]: allFields[currentField],
      }
    },
    {} as Partial<T>
  )

  return changedFieldValues
}
