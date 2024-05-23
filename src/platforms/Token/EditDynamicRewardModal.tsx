import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import useEditRolePlatform from "components/[guild]/AccessHub/hooks/useEditRolePlatform"
import Button from "components/common/Button"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useToast from "hooks/useToast"
import dynamic from "next/dynamic"
import rewards from "platforms/rewards"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformType, Requirement, RolePlatform } from "types"

const DynamicSetup = dynamic(
  () =>
    import(
      "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/DynamicSetup/DynamicRewardSetup"
    )
)

const EditDynamicRewardModal = ({
  isOpen,
  onClose,
  rolePlatform,
}: {
  isOpen: boolean
  onClose: () => void
  linkedRequirement?: Requirement
  rolePlatform: RolePlatform
}) => {
  const toast = useToast()

  const { onSubmit, isLoading } = useEditRolePlatform({
    rolePlatformId: rolePlatform.id,
    onSuccess: () => {
      toast({
        status: "success",
        title: `Successfully updated reward!`,
      })
      onClose()
    },
  })

  const methods = useForm({
    defaultValues: {
      dynamicAmount: rolePlatform.dynamicAmount,
    },
  })

  const propsHook =
    rewards[PlatformType[rolePlatform.guildPlatform.platformId]]?.cardPropsHook
  const { image = null } = propsHook ? propsHook(rolePlatform.guildPlatform) : {}
  const rewardName = rolePlatform.guildPlatform.platformGuildData.name

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"} colorScheme={"dark"}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Edit dynamic reward</ModalHeader>
        <ModalBody>
          <FormProvider {...methods}>
            <DynamicSetup
              toImage={<OptionImage img={image} alt={`${rewardName} image`} />}
              roleId={rolePlatform.roleId}
              requirementFieldName={`dynamicAmount.operation.input[0].requirementId`}
              multiplierFieldName={`dynamicAmount.operation.params.multiplier`}
              shouldFloor={
                (rolePlatform.dynamicAmount as any).operation.params
                  .shouldFloorResult
              }
            />
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={methods.handleSubmit(onSubmit)}
            isLoading={isLoading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EditDynamicRewardModal
