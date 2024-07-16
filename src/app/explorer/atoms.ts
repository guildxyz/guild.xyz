import { atom } from "jotai"
import { ActiveSection } from "./types"

export const isNavStuckAtom = atom(false)
export const isSearchStuckAtom = atom(false)
export const activeSectionAtom = atom(ActiveSection.YourGuilds)
