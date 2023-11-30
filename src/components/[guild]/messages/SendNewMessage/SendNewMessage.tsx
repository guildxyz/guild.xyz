import {
  ButtonProps,
  FormControl,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { Chat, PaperPlaneRight } from "phosphor-react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import useSendMessage, { SendMessageForm } from "../hooks/useSendMessage"
import RoleIdsSelect from "./components/RoleIdsSelect"

const SendNewMessage = (props: ButtonProps) => {
  const methods = useForm<SendMessageForm>({
    mode: "all",
    defaultValues: {
      protocol: "WEB3INBOX",
      destination: "ROLES",
      roleIds: [],
      message: "",
    },
  })
  const {
    control,
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = methods

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { onSubmit, isLoading } = useSendMessage(() => {
    reset()
    onClose()
  })

  const { id } = useGuild()
  const { data: members, isValidating: isMembersValidating } =
    useSWRWithOptionalAuth<{ roleId: number; members: `0x${string}`[] }[]>(
      isOpen ? `/v2/guilds/${id}/members` : null
    )

  const roleIds = useWatch({ control, name: "roleIds" })

  const targetedCount =
    !members || !roleIds.length
      ? 0
      : [
          ...new Set(
            members
              .filter((role) => roleIds.includes(role.roleId))
              .flatMap((role) => role.members)
          ),
        ].length

  const reachableCount = 0 // TODO: fetch from API
  const greenText = useColorModeValue("green.500", "green.300")

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
            <FormProvider {...methods}>
              <Stack spacing={6}>
                <FormControl isRequired isInvalid={!!errors.roleIds}>
                  <FormLabel>Receipent roles</FormLabel>

                  <RoleIdsSelect />

                  <FormErrorMessage>{errors.roleIds?.message}</FormErrorMessage>

                  <Text as="span" display="block" colorScheme="gray" pt={2}>
                    <Text
                      as="span"
                      fontWeight="bold"
                      color={reachableCount > 0 && greenText}
                    >
                      {reachableCount}
                    </Text>
                    <Text as="span" color={reachableCount > 0 && greenText}>
                      {" reachable "}
                    </Text>
                    <Text as="span" color="chakra-body-text">
                      {"/ "}
                    </Text>
                    <Text as="span" fontWeight="bold">
                      {isMembersValidating ? <Spinner size="xs" /> : targetedCount}
                    </Text>
                    {" targeted"}
                  </Text>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.message}>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    placeholder="Write your message here"
                    {...register("message", { required: "This field is required" })}
                  />
                  <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
                </FormControl>
              </Stack>
            </FormProvider>
          </ModalBody>

          <ModalFooter>
            <Button
              ml="auto"
              h={10}
              colorScheme="green"
              rightIcon={<PaperPlaneRight />}
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
              loadingText="Sending"
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
