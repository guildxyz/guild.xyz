import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"

const PointsAmountProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const { guildPlatform } = useGuildPlatform(requirement?.data?.guildPlatformId)
  const name = guildPlatform?.platformGuildData?.name || "points"
  return <>Amount of {name}</>
}

export default PointsAmountProvidedValue
