import { Schemas } from "@guildxyz/types"
import { atom } from "jotai"

export const profileAtom = atom<Schemas["Profile"] | undefined>(undefined)
