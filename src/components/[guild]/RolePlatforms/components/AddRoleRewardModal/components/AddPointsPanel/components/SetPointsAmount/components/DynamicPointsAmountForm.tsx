import { Icon, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import DynamicRewardSetup from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/DynamicSetup/DynamicRewardSetup"
import Button from "components/common/Button"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { ArrowSquareOut, Star } from "phosphor-react"
import type { ReactNode } from "react"
import InformationModal from "../../../../DynamicSetup/InformationModal"

const DynamicPointsAmountForm = ({ imageUrl, baseFieldPath }) => {
  const { targetRoleId } = useAddRewardContext()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const learnMoreOpacity = useColorModeValue(1, 0.7)

  const pointImage: ReactNode = imageUrl ? (
    <OptionImage img={imageUrl} alt={"Point type image"} />
  ) : (
    <Icon as={Star} />
  )

  return (
    <>
      <Text fontWeight="medium" colorScheme="gray" mt="-1" mb="5">
        {`Calculate user points based on a requirement provided amount, with a conversion rate applied. `}
        <Button
          variant="link"
          onClick={onOpen}
          rightIcon={<Icon as={ArrowSquareOut} />}
          iconSpacing={1}
          opacity={learnMoreOpacity}
        >
          Learn more
        </Button>
      </Text>
      <InformationModal {...{ isOpen, onClose }} />

      <DynamicRewardSetup
        roleId={targetRoleId as number}
        toImage={pointImage}
        multiplierFieldName={`${
          baseFieldPath ? baseFieldPath + "." : ""
        }dynamicAmount.operation.params.multiplier`}
        requirementFieldName={`${
          baseFieldPath ? baseFieldPath + "." : ""
        }dynamicAmount.operation.input.requirementId`}
        shouldFloor={true}
      />
    </>
  )
}

export default DynamicPointsAmountForm
