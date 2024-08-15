import { atom } from "jotai"
import { SUBSCRIPTIONS } from "./constants"
import { ChainData } from "./types"

export const chainDataAtom = atom<Partial<ChainData>>({
  chosenSubscription: SUBSCRIPTIONS[0],
})
