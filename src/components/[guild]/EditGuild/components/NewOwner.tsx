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
import { Warning } from "phosphor-react"
import { useState } from "react"

const NewOwner = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleClose = () => {
    onClose()
  }
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

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
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
              Are you sure, that you hand over your ownership? Your role will switch
              to owner.
            </Text>
            <ModalButton
              mt="8"
              // onClick={handleSubmit(onSubmit)}
              colorScheme="green"
            >
              Hand over ownership
            </ModalButton>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default NewOwner
