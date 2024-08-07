import {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"

const TO_FILTER_FLAG = "TO_FILTER"
const KEYS_TO_FILTER = new Set(["validAddresses", "balancyDecimals", "formFieldId"])
const DIRTY_KEYS_TO_KEEP = [
  // data & chain (of a requirement) is kept, because if we send partial data, that will overwrite the whole data field
  "data",
  "chain",
  "socialLinks",
]
// Keys to keep even if they aren't dirty
const KEYS_TO_KEEP = [
  // There's a chance that we send empty arrays intentionally e.g. inside a contract call's guildPlatformData
  "argsToSign",

  // These are processed into creates/updates/deletes in a useSubmit's fetcher. Therefore we need all of them to know if we need to delete some. Otherwise we couldn't tell if something needs to be deleted, or just hasn't been changed
  "admins",
  "contacts",
  "featureFlags",
  "type",
]

/**
 * Takes formData, and its dirtyFields flags, and returns a new object, that is a new
 * object constructed by keeping only the values of formData where dirtyFields is
 * true. It recursively travels through the entire object, so nested objects, and
 * arrays are handled. For object, that is dirty based on its fields, if it has an
 * "id" fields, it is also kept. This is because, when sending the PUT requests, we
 * need to know the id of te entity.
 *
 * @param dirtyFields FormState.dirtyFields from the form
 * @param formData Form values from handleSubmit's onValid callback
 * @returns A new object, that is a subset of formData based on dirtyFields
 */
const formDataFilterForDirtyHelper = (dirtyFields: any, formData: any) => {
  if (typeof formData === "undefined") {
    return TO_FILTER_FLAG
  }

  if (Array.isArray(dirtyFields)) {
    const newArr = dirtyFields
      .map((field, index) => formDataFilterForDirtyHelper(field, formData[index]))
      .filter((item) => item !== TO_FILTER_FLAG)

    return newArr.length > 0 ? newArr : TO_FILTER_FLAG
  }

  if (typeof dirtyFields === "object") {
    const newObj = Object.fromEntries(
      Object.entries(dirtyFields)
        .map(([key, value]) => [
          key,
          formDataFilterForDirtyHelper(value, formData[key]),
        ])
        .filter(
          ([key, value]) => value !== TO_FILTER_FLAG && !KEYS_TO_FILTER.has(key)
        )
    )

    DIRTY_KEYS_TO_KEEP.forEach((keyToKeep) => {
      if (keyToKeep in dirtyFields) {
        newObj[keyToKeep] = formData[keyToKeep]
      }
    })

    const isEmpty = Object.keys(newObj).length <= 0

    // Re-attach id field to dirty objects
    if (!isEmpty && "id" in formData) {
      newObj.id = formData.id
    }

    KEYS_TO_KEEP.forEach((keyToKeep) => {
      if (keyToKeep in formData) {
        newObj[keyToKeep] = formData[keyToKeep]
      }
    })

    return !isEmpty ? newObj : TO_FILTER_FLAG
  }

  // At this point dirtyFields is a boolean
  return dirtyFields && formData !== TO_FILTER_FLAG ? formData : TO_FILTER_FLAG
}

const formDataFilterForDirty = (dirtyFields: any, formData: any) => {
  const filtered = formDataFilterForDirtyHelper(dirtyFields, formData)
  return filtered === "TO_FILTER" ? null : filtered
}

const handleSubmitDirty =
  <TFieldValues extends FieldValues = FieldValues, TContext = any>(
    methods: UseFormReturn<TFieldValues, TContext>
  ) =>
  (
    onValid: SubmitHandler<Partial<TFieldValues>>,
    onInvalid?: SubmitErrorHandler<TFieldValues>
  ) =>
    methods.handleSubmit((formValues) => {
      onValid(
        (formDataFilterForDirty(methods.formState.dirtyFields, formValues) ??
          {}) as Partial<TFieldValues>
      )
    }, onInvalid)

export default handleSubmitDirty
