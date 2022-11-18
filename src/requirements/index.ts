import { Icon } from "phosphor-react"
import { ComponentType } from "react"
import { Requirement } from "types"
import { RequirementProps } from "./common/Requirement"
import REQUIREMENTS_DATA from "./requirements"

// transform it to an object with types as keys so we don't have to use .find() every time
const REQUIREMENTS: Record<RequirementType, RequirementData> =
  REQUIREMENTS_DATA.reduce(
    (acc, curr) => (curr.types.map((type) => (acc[type] = curr)), acc),
    {} as any
  )

const requirementTypes = REQUIREMENTS_DATA.flatMap((obj) => obj.types)
export type RequirementType = typeof requirementTypes[number]

export type RequirementFormProps = {
  baseFieldPath: string
  field?: Requirement
}

export type RequirementComponentProps = {
  requirement: Requirement
} & RequirementProps

export type RequirementData = {
  icon: string | Icon
  name: string
  fileNameBase: string
  readonly types: string[]
  disabled?: boolean
  displayComponent: ComponentType<RequirementComponentProps>
  formComponent: ComponentType<RequirementFormProps>
}

export default REQUIREMENTS
export { REQUIREMENTS_DATA }
