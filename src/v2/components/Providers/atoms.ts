import { atom } from "jotai"
import { AddressLinkParams } from "./types"

export const accountModalAtom = atom(false)
export const walletSelectorModalAtom = atom(false)
export const addressLinkParamsAtom = atom<AddressLinkParams>({
  userId: undefined,
  address: undefined,
})
export const walletLinkHelperModalAtom = atom(false)
