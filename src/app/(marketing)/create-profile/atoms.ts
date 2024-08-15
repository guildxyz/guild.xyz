import { atom } from "jotai"
import { ChainData } from "./types"

export const chainDataAtom = atom<Partial<ChainData>>({})
