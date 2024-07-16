import { atom } from "jotai"
import { AddRewardForm } from "./types"

export const ADD_REWARD_FORM_DEFAULT_VALUES: AddRewardForm = {
  rolePlatforms: [],
  requirements: [{ type: "FREE" }],
  roleIds: [],
  visibility: "PUBLIC",
}

export const canCloseAddRewardModalAtom = atom(true)
