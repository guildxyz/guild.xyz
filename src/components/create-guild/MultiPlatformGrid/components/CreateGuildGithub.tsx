import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import GitHubGuildSetup from "components/common/GitHubGuildSetup"
import { useFieldArray, useFormContext } from "react-hook-form"
import { GuildFormType, PlatformType } from "types"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CreateGuildGithub = ({ isOpen, onClose }: Props): JSX.Element => {
  const { control } = useFormContext<GuildFormType>()
  // Will be removed in another PR, so added an any type here
  const { append } = useFieldArray<any>({
    control,
    name: "guildPlatforms",
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      colorScheme="dark"
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Repositories</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <GitHubGuildSetup
            onSelection={(newSelectedRepo) => {
              append({
                platformName: "GITHUB",
                platformGuildId: newSelectedRepo,
                platformId: PlatformType.GITHUB,
                platformGuildData: {
                  name: newSelectedRepo,
                } as any, // TODO for later: define the PlatformGuildData types properly
              })
              onClose()
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreateGuildGithub
