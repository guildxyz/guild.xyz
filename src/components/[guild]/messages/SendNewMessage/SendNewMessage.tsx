import { Link } from "@chakra-ui/next-js"
import {
  ButtonProps,
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { XMTPProvider } from "@xmtp/react-sdk"
import { useIsTabsStuck } from "components/[guild]/Tabs"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import { Chat, PaperPlaneRight } from "phosphor-react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import useReachableUsers from "../hooks/useReachableUsers"
import useSendMessage from "../hooks/useSendMessage"
import useTargetedCount from "../hooks/useTargetedCount"
import RoleIdsSelect from "./components/RoleIdsSelect"
import { useFetcherWithSign } from "../../../../utils/fetcher"
import useUser from "../../hooks/useUser"
import useSWR from "swr"

export type MessageProtocol = "XMTP" | "WEB3INBOX"
export type MessageDestination = "GUILD" | "ADMINS" | "ROLES"
type SenderType = "USER" | "GUILD"

const SenderTypes: Record<MessageProtocol, SenderType> = {
  WEB3INBOX: "GUILD",
  XMTP: "USER",
}

export type SendMessageForm = {
  protocol: MessageProtocol
  destination: MessageDestination
  roleIds: number[]
  senderType: SenderType
  message: string
}

const SendNewMessage = (props: ButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <>
      <Button
        leftIcon={<Chat />}
        onClick={onOpen}
        {...(!isStuck && {
          color: textColor,
          colorScheme: buttonColorScheme,
        })}
        {...props}
      >
        New message
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <MessageModalContent onClose={onClose} />
      </Modal>
    </>
  )
}
type MessageModalContentProps = { onClose: () => void }

const MessageModalContent = ({ onClose }: MessageModalContentProps) => {
  const methods = useForm<SendMessageForm>({
    mode: "all",
    defaultValues: {
      protocol: "WEB3INBOX",
      destination: "ROLES",
      senderType: "GUILD",
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
    setValue,
  } = methods

  const fetcherWithSign = useFetcherWithSign()
  const { id: userId } = useUser()

  const { data: xmtpKeys } = useSWR<{ keys: string[] }>(
    userId ? `/v2/users/${userId}/keys` : null,
    (url: string) =>
      fetcherWithSign([
        url,
        {
          method: "GET",
          body: {
            Accept: "application/json",
            query: { service: "XMTP" },
          },
        },
      ])
  )

  const { onSubmit, isLoading } = useSendMessage(() => {
    reset()
    onClose()
  }, xmtpKeys?.keys)
  console.log(xmtpKeys)
  const roleIds = useWatch({ control, name: "roleIds" })
  const protocol = useWatch({ control, name: "protocol" })

  const { targetedCount, isTargetedCountValidating } = useTargetedCount(roleIds)
  const { data: reachableUsers, isValidating: isReachableUsersLoading } =
    useReachableUsers(protocol, "ROLES", roleIds)

  const greenTextColor = useColorModeValue("green.600", "green.300")

  return (
    <XMTPProvider>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send new message</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormProvider {...methods}>
            <Stack spacing={6}>
              <Stack>
                <VStack spacing={6}>
                  <FormControl isRequired isInvalid={!!errors.protocol}>
                    <FormLabel>Select protocol</FormLabel>
                    <Select
                      {...register("protocol", {
                        onChange: ({ target }) =>
                          setValue("senderType", SenderTypes[target.value]),
                      })}
                    >
                      <option value={"WEB3INBOX"}>Web3Inbox</option>
                      <option value={"XMTP"}>XMTP</option>
                    </Select>
                    <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.roleIds}>
                    <FormLabel>Recipient roles</FormLabel>
                    <RoleIdsSelect />
                    <FormErrorMessage>{errors.roleIds?.message}</FormErrorMessage>
                    <Text colorScheme="gray" pt={2}>
                      <Text
                        as="span"
                        fontWeight="bold"
                        color={reachableUsers?.length > 0 && greenTextColor}
                      >
                        {isReachableUsersLoading ? (
                          <Spinner size="xs" />
                        ) : (
                          reachableUsers?.length ?? 0
                        )}
                      </Text>
                      <Text
                        as="span"
                        color={reachableUsers?.length > 0 && greenTextColor}
                      >
                        {" reachable "}
                      </Text>
                      <Text as="span" color="chakra-body-text">
                        {"/ "}
                      </Text>
                      <Text as="span" fontWeight="bold">
                        {isTargetedCountValidating ? (
                          <Spinner size="xs" />
                        ) : (
                          targetedCount
                        )}
                      </Text>
                      {" targeted"}
                    </Text>
                  </FormControl>
                </VStack>

                <Text>
                  {protocol === "WEB3INBOX" ? (
                    <>
                      You can only message users who've subscribed to Guild on{" "}
                      <Link
                        href="https://web3inbox.com"
                        colorScheme="blue"
                        isExternal
                      >
                        https://web3inbox.com
                      </Link>
                    </>
                  ) : (
                    <>
                      You can only message users who've already used XMTP. Ask them
                      to connect their wallet on{" "}
                      <Link href="https://xmtp.com" colorScheme="blue" isExternal>
                        https://xmtp.com
                      </Link>{" "}
                      to start accepting messages!{" "}
                    </>
                  )}
                </Text>
              </Stack>
              <FormControl isRequired isInvalid={!!errors.message}>
                <FormLabel>Message</FormLabel>
                <Textarea
                  placeholder="Write your message here"
                  {...register("message", {
                    required: "This field is required",
                    maxLength: {
                      value: 255,
                      message: "Maximum XMTP message length is 255 characters",
                    },
                  })}
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
    </XMTPProvider>
  )
}

export default SendNewMessage
