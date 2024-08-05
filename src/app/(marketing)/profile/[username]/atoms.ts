import { Schemas } from "@guildxyz/types"
import { atom } from "jotai"
import { ParsedContribution } from "../_hooks/useContribution"

// TODO: assertion here prevents WritableAtom type error, handle uninitialized atom with proper types
export const profileAtom = atom(undefined as unknown as Schemas["Profile"])
export const contributionsAtom = atom(undefined as unknown as ParsedContribution[])
