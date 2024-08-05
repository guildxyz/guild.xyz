import { Schemas } from "@guildxyz/types"
import { atom } from "jotai"

// TODO: assertion here prevents WritableAtom type error, handle uninitialized atom with proper types
export const profileAtom = atom(undefined as unknown as Schemas["Profile"])
