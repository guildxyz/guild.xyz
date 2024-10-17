import { SelectOption } from "types"
import { LensActionType, LensReaction } from "./types"

export const reactionOptions: SelectOption<LensReaction>[] = [
  {
    label: "Any",
    value: "ANY",
  },
  {
    label: "Upvote",
    value: "UPVOTE",
  },
  {
    label: "Downvote",
    value: "DOWNVOTE",
  },
]

export const actionOptions: SelectOption<LensActionType>[] = [
  {
    label: "Comment",
    value: "COMMENT",
  },
  {
    label: "Quote",
    value: "QUOTE",
  },
  {
    label: "Mirror",
    value: "MIRROR",
  },
]

export const lensPlatformOptions: SelectOption[] = [
  {
    label: "Hey",
    value: "hey",
  },
  {
    label: "Orb",
    value: "orb",
  },
  {
    label: "Phaver",
    value: "phaver",
  },
  {
    label: "Tape",
    value: "tape",
  },
  {
    label: "Buttrfly",
    value: "buttrfly",
  },
  {
    label: "BloomersTV",
    value: "bloomers.tv",
  },
  {
    label: "Kaira",
    value: "kaira",
  },
  {
    label: "Yup",
    value: "yup",
  },
  {
    label: "Orna",
    value: "orna.art",
  },
  {
    label: "Firefly",
    value: "firefly",
  },
]
