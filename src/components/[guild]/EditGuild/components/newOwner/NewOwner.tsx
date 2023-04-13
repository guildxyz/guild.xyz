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
import useGuild from "components/[guild]/hooks/useGuild"
import ModalButton from "components/common/ModalButton"
import useToast from "hooks/useToast"
import { Warning } from "phosphor-react"
import { useState } from "react"
import useNewOwner from "./hooks/useNewOwner"

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

const ADDRESS_REGEX = /^0x[a-f0-9]{40}$/i

const NewOwnerModal = ({ isOpen, onClose }) => {
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
          id: admin.id,
          address: admin.address,
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

  const { onSubmit, isLoading } = useNewOwner({ onSuccess })

  return (
    <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb="7">Hand over ownership</ModalHeader>
        <ModalCloseButton />
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
            isDisabled={!ADDRESS_REGEX.test(newOwner)}
          >
            Hand over ownership
          </ModalButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default NewOwner
