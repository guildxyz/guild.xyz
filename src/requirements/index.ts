import { RequirementProps } from "components/[guild]/Requirements/components/Requirement"
import { Icon } from "phosphor-react"
import { ComponentType } from "react"
import { UseControllerProps } from "react-hook-form"
import { Requirement } from "types"
import useTokenProvidedValue from "./Token/hooks/useTokenProvidedValue"
import REQUIREMENTS_DATA from "./requirements"

// transform it to an object with types as keys so we don't have to use .find() every time
const REQUIREMENTS: Record<RequirementType, RequirementData> =
  REQUIREMENTS_DATA.reduce(
    (acc, curr) => (curr.types.map((type) => (acc[type] = curr)), acc),
    {} as any
  )

const DYNAMIC_REQUIREMENT_TYPES: Partial<
  Record<RequirementType, RequirementDynamicData>
> = {
  ERC20: {
    providedValueHook: useTokenProvidedValue,
  },
}

const requirementTypes = REQUIREMENTS_DATA.flatMap((obj) => obj.types)
export type RequirementType = (typeof requirementTypes)[number] | "HIDDEN"

export type RequirementFormProps = {
  baseFieldPath: string
  field?: Requirement
  addRequirement?: () => void
  setOnCloseAttemptToast?: (msg: string | boolean) => void
}

export type ProvidedValueHook = () => {
  type: string
  info: string
  image: string | JSX.Element
}

export type RequirementDynamicData = {
  providedValueHook: ProvidedValueHook
}

export type RequirementData = {
  icon: string | Icon
  name: string
  readonly types: string[]
  disabled?: boolean
  isPlatform?: boolean
  customNameRules?: UseControllerProps["rules"]
  isNegatable?: boolean
  displayComponent: ComponentType<RequirementProps>
  formComponent: ComponentType<RequirementFormProps>
}

export default REQUIREMENTS
export { DYNAMIC_REQUIREMENT_TYPES, REQUIREMENTS_DATA }
