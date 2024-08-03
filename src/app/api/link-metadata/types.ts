import { OneOf } from "types"

export type LinkMetadata = OneOf<
  {
    title: string
  },
  { error: string }
>
