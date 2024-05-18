import { Icon } from "@chakra-ui/react"
import SetPointsAmount from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/SetPointsAmount"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import dynamic from "next/dynamic"
import { Star } from "phosphor-react"
import { ReactNode } from "react"

const DynamicSetup = dynamic(
  () =>
    import(
      "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/DynamicSetup/DynamicRewardSetup"
    )
)

const PointsCardSettings = () => {
  const { guildPlatform, index, dynamicAmount, roleId } = useRolePlatform()
  const { name, imageUrl } = guildPlatform.platformGuildData

  const pointImage: ReactNode = imageUrl ? (
    <OptionImage img={imageUrl} alt={"Point type image"} />
  ) : (
    <Icon as={Star} />
  )

  if (!!dynamicAmount)
    return (
      <DynamicSetup
        roleId={roleId}
        toImage={pointImage}
        multiplierFieldName={`rolePlatforms.${index}.dynamicAmount.operation.params.multiplier`}
        requirementFieldName={`rolePlatforms.${index}.dynamicAmount.operation.input.requirementId`}
      />
    )

  return (
    <SetPointsAmount
      {...{ name, imageUrl }}
      fieldName={`rolePlatforms.${index}.platformRoleData.score`}
    />
  )
}

export default PointsCardSettings
