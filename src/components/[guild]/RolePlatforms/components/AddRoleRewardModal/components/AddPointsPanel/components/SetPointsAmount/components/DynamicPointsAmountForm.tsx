import { Icon, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import DynamicRewardSetup from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/DynamicSetup/DynamicRewardSetup"
import { useEditRolePlatformContext } from "components/[guild]/RolePlatforms/components/EditRolePlatformModal"
import Button from "components/common/Button"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { type ReactNode, useEffect } from "react"
import { useWatch } from "react-hook-form"
import { PiArrowSquareOut } from "react-icons/pi"
import { PiStar } from "react-icons/pi"
import InformationModal from "../../../../DynamicSetup/InformationModal"

const DynamicPointsAmountForm = ({ imageUrl, baseFieldPath }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const learnMoreOpacity = useColorModeValue(1, 0.7)

  const pointImage: ReactNode = imageUrl ? (
    <OptionImage img={imageUrl} alt={"Point type image"} />
  ) : (
    <Icon as={PiStar} />
  )

  const requirementId = useWatch({
    name: `${
      baseFieldPath ? baseFieldPath + "." : ""
    }dynamicAmount.operation.input.requirementId`,
  })

  const { setIsSubmitDisabled = null } = useEditRolePlatformContext() || {}

  useEffect(() => {
    setIsSubmitDisabled?.(!requirementId)
    return () => {
      setIsSubmitDisabled?.(false)
    }
  }, [requirementId, setIsSubmitDisabled])

  return (
    <>
      <Text fontWeight="medium" colorScheme="gray" mt="-1" mb="5">
        {`Calculate user points based on a requirement provided amount, with a conversion rate applied. `}
        <Button
          variant="link"
          onClick={onOpen}
          rightIcon={<Icon as={PiArrowSquareOut} />}
          iconSpacing={1}
          opacity={learnMoreOpacity}
        >
          Learn more
        </Button>
      </Text>
      <InformationModal {...{ isOpen, onClose }} />

      <DynamicRewardSetup
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
