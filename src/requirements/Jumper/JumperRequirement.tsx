import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { ComponentType } from "react"
import REQUIREMENTS from "requirements"
import { JumperRequirementType } from "./types"

const JumperLevelDisplay = () => {
  const { data } = useRequirementContext<"JUMPER_LEVEL">()

  return `Wallet level ${data.minAmount} or above`
}

const JumperTypeDisplay = () => {
  const { data } = useRequirementContext<"JUMPER_TYPE">()

  return `Get a reward with type ${data.rewardType}`
}

const JumperTraitsDisplay = () => {
  const { data } = useRequirementContext<"JUMPER_TRAITS">()

  if ("category" in data && "name" in data)
    return `Get a trait in the ${data.category} category with title ${data.name}`

  if ("category" in data) return `Get a trait in the ${data.category} category`

  return `Get a trait with title ${data.name}`
}

const DisplayComponents = {
  JUMPER_LEVEL: JumperLevelDisplay,
  JUMPER_TYPE: JumperTypeDisplay,
  JUMPER_TRAITS: JumperTraitsDisplay,
} satisfies Record<JumperRequirementType, ComponentType>

const JumperRequirement = (props: RequirementProps) => {
  const { type } = useRequirementContext<JumperRequirementType>()
  const DisplayComponent = DisplayComponents[type]

  return (
    <Requirement image={REQUIREMENTS.JUMPER_LEVEL.icon as string}>
      <DisplayComponent />
    </Requirement>
  )
}

export default JumperRequirement
