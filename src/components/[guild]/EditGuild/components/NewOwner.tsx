import {
  Button,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import ModalButton from "components/common/ModalButton"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { Warning } from "phosphor-react"
import { useState } from "react"
import fetcher from "utils/fetcher"

const NewOwner = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <HStack justifyContent="end">
        <Button
          size="sm"
          as="label"
          variant="outline"
          fontWeight="medium"
          onClick={onOpen}
          data-dd-action-name="hand over ownership"
        >
          Hand over ownership
        </Button>
      </HStack>

      <NewOwnerModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

const NewOwnerModal = ({ isOpen, onClose }) => {
  const { mutateGuild, id } = useGuild()
  const [newOwner, setNewOwner] = useState("")
  const changeOwner = async (signedValidation: SignedValdation) => {
    fetcher(`/guild/${id}/ownership`, {
      method: "PUT",
      ...signedValidation,
    })
  }
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { onSubmit, isLoading } = useSubmitWithSign(changeOwner, {
    forcePrompt: true,
    onSuccess: () => {
      toast({
        title: `Owner changed!`,
        status: "success",
      })
      mutateGuild()
      onClose()
    },
    onError: (error) => showErrorToast(error),
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      colorScheme="dark"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        {" "}
        <ModalHeader pb="7">Hand over ownership</ModalHeader>
        <ModalCloseButton />{" "}
        <ModalBody>
          <Text mb="6" fontSize={"lg"}>
            Are you sure, that you hand over your ownership? Your role will switch to
            owner.
          </Text>
          <Input
            type="url"
            placeholder="new owner"
            onChange={(e) => setNewOwner(e.target.value)}
          />
          <ModalButton
            mt="8"
            onClick={() => onSubmit({ to: newOwner })}
            colorScheme="green"
            leftIcon={
              isLoading ? (
                <Spinner size="sm" />
              ) : (
                <Icon as={Warning} color="red.500" />
              )
            }
            isDisabled={newOwner.length !== 42 || !newOwner.startsWith("0x")}
          >
            Hand over ownership
          </ModalButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default NewOwner
