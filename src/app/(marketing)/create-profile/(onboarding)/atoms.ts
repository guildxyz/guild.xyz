import { atom } from "jotai"
import { SUBSCRIPTIONS } from "./constants"
import { CreateProfileData } from "./types"

export const createProfileDataAtom = atom<Partial<CreateProfileData>>({
  chosenSubscription: SUBSCRIPTIONS[0],
  subscription: true,
})
