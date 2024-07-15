import { Schemas } from "@guildxyz/types"
import { Icon } from "@phosphor-icons/react/dist/lib/types"
import { UseControllerProps } from "react-hook-form"
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
  icon: string | Icon
  name: string
  readonly types: RequirementType[]
  disabled?: boolean
  isPlatform?: boolean
  customNameRules?: UseControllerProps["rules"]
  isNegatable?: boolean
}
