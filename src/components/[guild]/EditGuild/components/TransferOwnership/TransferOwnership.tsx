import {
  FormLabel,
  HStack,
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
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import useToast from "hooks/useToast"
import { useState } from "react"
import useTransferOwnership from "./hooks/useTransferOwnership"

const TransferOwnership = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        size="xs"
        variant="ghost"
        borderRadius={"lg"}
        onClick={onOpen}
        data-dd-action-name="hand over ownership"
      >
        <Text colorScheme={"gray"}>Hand over ownership</Text>
      </Button>
      <TransferOwnershipModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

const ADDRESS_REGEX = /^0x[a-f0-9]{40}$/i

const TransferOwnershipModal = ({ isOpen, onClose }) => {
  const [newOwner, setNewOwner] = useState("")
  const { mutateGuild } = useGuild()
  const toast = useToast()

  const onSuccess = (res) => {
    toast({
      title: "Owner changed!",
      status: "success",
    })
    onClose()
    mutateGuild(
      (oldData) => {
        const newAdmins = oldData.admins.map((admin) => ({
          ...admin,
          isOwner: admin.id === res.id,
        }))
        if (newAdmins.every((admin) => admin.isOwner === false)) newAdmins.push(res)
        return {
          ...oldData,
          admins: newAdmins,
        }
      },
      { revalidate: false }
    )
  }

  const { onSubmit, isLoading } = useTransferOwnership({ onSuccess })

  return (
    <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb="3">Hand over ownership</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb="6">
            Are you sure that you want to hand over your ownership? You'll remain an
            admin, but the new owner will be able to remove you anytime.
          </Text>
          <FormLabel>New owner</FormLabel>

          <Input
            fontSize="lg"
            type="url"
            placeholder="Paste address"
            onChange={(e) => setNewOwner(e.target.value)}
          />
          <HStack justifyContent="end">
            <Button
              mt="8"
              ml="auto"
              onClick={() => onSubmit({ to: newOwner })}
              colorScheme="red"
              leftIcon={isLoading ? <Spinner size="sm" /> : null}
              isDisabled={!ADDRESS_REGEX.test(newOwner)}
            >
              Hand over ownership
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default TransferOwnership
