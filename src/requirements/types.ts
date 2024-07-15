import { Schemas } from "@guildxyz/types"
import { UseControllerProps } from "react-hook-form"
import type { PiIcon } from "react-icons/pi"
import { Requirement } from "types"

export type RequirementType = Schemas["Requirement"]["type"]

export type RequirementFormProps = {
  baseFieldPath: string
  field?: Requirement
  addRequirement?: () => void
  setOnCloseAttemptToast?: (msg: string | boolean) => void
  providerTypesOnly?: boolean
}

export type RequirementData = {
  icon: string | PiIcon
  name: string
  readonly types: RequirementType[]
  disabled?: boolean
  isPlatform?: boolean
  customNameRules?: UseControllerProps["rules"]
  isNegatable?: boolean
}
