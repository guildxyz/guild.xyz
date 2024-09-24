import { atom } from "jotai"
import { PlatformName } from "types"
import { AddressLinkParams } from "./types"

export const accountModalAtom = atom(false)
export const walletSelectorModalAtom = atom(false)
export const addressLinkParamsAtom = atom<AddressLinkParams>({
  userId: undefined,
  address: undefined,
})
export const walletLinkHelperModalAtom = atom(false)
export const platformMergeAlertAtom = atom<
  | false
  | { addressOrDomain: string; platformName: PlatformName; onConnect?: () => void }
>(false)
