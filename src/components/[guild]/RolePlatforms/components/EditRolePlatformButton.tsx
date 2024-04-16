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
import { useAtom } from "jotai"
import rewards from "platforms/rewards"
import { useRef } from "react"
import { useFormState } from "react-hook-form"
import { PlatformType, RolePlatform } from "types"
import { openRewardSettingsGuildPlatformIdAtom } from "../RolePlatforms"
import { useRolePlatform } from "./RolePlatformProvider"

const EditRolePlatformButton = ({ SettingsComponent, rolePlatform }) => {
  const [openGuildPlatformSettingsId, setOpenGuildPlatformSettingsId] = useAtom(
    openRewardSettingsGuildPlatformIdAtom
  )
  const isOpen = openGuildPlatformSettingsId === rolePlatform.guildPlatformId
  const onOpen = () => setOpenGuildPlatformSettingsId(rolePlatform.guildPlatformId)
  const onClose = () => setOpenGuildPlatformSettingsId(null)

  const modalContentRef = useRef()
  const {
    index,
    guildPlatform: { platformId },
  } = useRolePlatform()

  const { errors } = useFormState()
  const hasError = !!errors?.rolePlatforms?.[index]

  const rewardName =
    (rolePlatform as RolePlatform).guildPlatform?.platformGuildName ??
    rewards[PlatformType[platformId]].name

  return (
    <>
      <Button
        size="sm"
        onClick={onOpen}
        ml={{ base: 0, md: 3 }}
        mt={{ base: 3, md: 0 }}
      >
        Edit
      </Button>
      <Modal
        {...{ isOpen, onClose }}
        scrollBehavior="inside"
        colorScheme={"dark"}
        initialFocusRef={modalContentRef}
        size="xl"
        closeOnEsc={!hasError}
        closeOnOverlayClick={!hasError}
      >
        <ModalOverlay />
        <ModalContent ref={modalContentRef}>
          <ModalHeader>{`${rewardName} reward settings`}</ModalHeader>
          <ModalBody>
            <VStack spacing={8} alignItems="start">
              <SettingsComponent index={index} />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={onClose} isDisabled={hasError}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditRolePlatformButton
