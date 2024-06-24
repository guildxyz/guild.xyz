import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import rewards from "platforms/rewards"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformType, RoleFormType, RolePlatform } from "types"
import { RolePlatformProvider } from "./RolePlatformProvider"

type Props = {
  rolePlatform: RoleFormType["rolePlatforms"][number]
  onSubmit: (data: Partial<RolePlatform>) => void
  onClose: () => void
  isOpen: boolean
}

const EditRolePlatformModal = ({
  rolePlatform,
  onClose,
  isOpen,
  onSubmit,
}: Props) => {
  const methods = useForm()

  const modalContentRef = useRef()

  const rewardName =
    rolePlatform.guildPlatform?.platformGuildName ??
    rewards[PlatformType[rolePlatform.guildPlatform.platformId]].name

  const { cardSettingsComponent: SettingsComponent } =
    rewards[PlatformType[rolePlatform?.guildPlatform?.platformId]]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      colorScheme={"dark"}
      initialFocusRef={modalContentRef}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent ref={modalContentRef}>
        <ModalHeader>{`${rewardName} reward settings`}</ModalHeader>
        <ModalBody>
          <VStack spacing={8} alignItems="start">
            <FormProvider {...methods}>
              <RolePlatformProvider rolePlatform={rolePlatform}>
                <SettingsComponent />
              </RolePlatformProvider>
            </FormProvider>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" onClick={methods.handleSubmit(onSubmit)}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EditRolePlatformModal
