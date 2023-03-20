import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
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
  const [newOwner, setNewOwner] = useState("")

  return (
    <>
      <FormControl w="full">
        <HStack>
          <FormLabel mb="0">Hand over owner role</FormLabel>
        </HStack>
        <Text colorScheme="gray" mb={2}>
          You will lose your ownership and become an admin{" "}
        </Text>
        <Stack direction={["column", "row"]} spacing={4} alignItems="center">
          <Input
            type="url"
            placeholder="new owner"
            onChange={(e) => setNewOwner(e.target.value)}
          />
          <Button
            isDisabled={newOwner.length !== 42}
            px="64px"
            as="label"
            variant="outline"
            leftIcon={<Icon as={Warning} color="red" />}
            fontWeight="medium"
            onClick={onOpen}
            data-dd-action-name="hand over ownership"
          >
            Hand over ownership
          </Button>
        </Stack>
      </FormControl>

      <NewOwnerModal isOpen={isOpen} onClose={onClose} newOwner={newOwner} />
    </>
  )
}

const NewOwnerModal = ({ isOpen, onClose, newOwner }) => {
  const { id } = useGuild()

  const changeOwner = async (signedValidation: SignedValdation) => {
    fetcher(`/guild/${id}/ownership`, {
      method: "PUT",
      ...signedValidation,
    })
  }
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { onSubmit } = useSubmitWithSign(changeOwner, {
    onSuccess: () => {
      toast({
        title: `Owner changed!`,
        status: "success",
      })
      onClose()
    },
    onError: (error) => showErrorToast(error),
    forcePrompt: true,
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
          <ModalButton
            mt="8"
            onClick={() => onSubmit({ to: newOwner })}
            colorScheme="green"
          >
            Hand over ownership
          </ModalButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default NewOwner
