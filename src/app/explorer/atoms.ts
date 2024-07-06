import { atom } from "jotai"
import { ActiveSection } from "./types"

export const isNavStuckAtom = atom(false)
export const isSeachStuckAtom = atom(false)
export const activeSectionAtom = atom(ActiveSection.YourGuilds)
export const guildQueryAtom = atom("")
