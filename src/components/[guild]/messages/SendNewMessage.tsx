import {
  ButtonProps,
  FormControl,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { Chat, PaperPlaneRight } from "phosphor-react"

const SendNewMessage = (props: ButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button leftIcon={<Chat />} {...props} onClick={onOpen}>
        New message
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send new message</ModalHeader>

          <ModalBody>
            <Stack spacing={6}>
              <FormControl>
                <FormLabel>Receipent roles</FormLabel>
                <Select placeholder="Select roles" />

                <Text as="span" display="block" colorScheme="gray" pt={2}>
                  <Text as="span" fontWeight="bold">
                    0
                  </Text>
                  {" reachable "}
                  <Text as="span" color="chakra-body-text">
                    {"/ "}
                  </Text>
                  <Text as="span" fontWeight="bold">
                    0
                  </Text>
                  {" targeted"}
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea placeholder="Write your message here" />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              ml="auto"
              h={10}
              colorScheme="green"
              rightIcon={<PaperPlaneRight />}
              onClick={onClose}
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SendNewMessage
