import { Icon, Text } from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import DynamicRewardSetup from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/DynamicSetup/DynamicRewardSetup"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { Star } from "phosphor-react"
import type { ReactNode } from "react"

const DynamicPointsAmountForm = ({ imageUrl, baseFieldPath }) => {
  const { targetRoleId } = useAddRewardContext()

  const pointImage: ReactNode = imageUrl ? (
    <OptionImage img={imageUrl} alt={"Point type image"} />
  ) : (
    <Icon as={Star} />
  )

  return (
    <>
      <Text fontWeight="medium" colorScheme="gray" mt="-1" mb="5">
        Calculate user points based on a requirement provided amount (e.g. their
        token balance), with a conversion rate applied
      </Text>

      <DynamicRewardSetup
        roleId={targetRoleId as number}
        toImage={pointImage}
        multiplierFieldName={`${baseFieldPath}.dynamicAmount.operation.params.multiplier`}
        requirementFieldName={`${baseFieldPath}.dynamicAmount.operation.input.requirementId`}
        shouldFloor={true}
      />
    </>
  )
}

export default DynamicPointsAmountForm
