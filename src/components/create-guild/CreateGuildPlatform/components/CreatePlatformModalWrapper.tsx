import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import { PropsWithChildren } from "react"
import { Rest } from "types"

const CreatePlatformModalWrapper = ({
  children,
  ...rest
}: PropsWithChildren<Rest>) => {
  const { platform, setPlatform } = useCreateGuildContext()

  return (
    <Modal
      isOpen={!!platform}
      onClose={() => {
        setPlatform(null)
      }}
      scrollBehavior="inside"
      colorScheme="dark"
      {...rest}
    >
      <ModalOverlay />
      <ModalContent>{children}</ModalContent>
    </Modal>
  )
}

export default CreatePlatformModalWrapper
