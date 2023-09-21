import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  AvatarBadge,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import useAccess from "components/[guild]/hooks/useAccess"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { motion } from "framer-motion"
import useToast from "hooks/useToast"
import { LinkBreak, Question } from "phosphor-react"
import platforms from "platforms/platforms"
import { memo, ReactNode, useRef } from "react"
import { PathString } from "react-hook-form"
import { PlatformName } from "types"
import useDisconnect, { useDisconnectEmail } from "../hooks/useDisconnect"

type Props = {
  type: PlatformName
}

const MotionHStack = motion(HStack)

const SocialAccount = memo(({ type }: Props): JSX.Element => {
  const { platformUsers } = useUser()
  const accesses = useAccess()
  const platformUser = platformUsers?.find(
    (platform) => platform.platformName.toString() === type
  )

  const isReconnect =
    !!accesses &&
    accesses?.data?.some(({ errors }) =>
      errors?.some(
        ({ errorType, subType }) =>
          errorType === "PLATFORM_CONNECT_INVALID" && subType?.toUpperCase() === type
      )
    )

  return (
    <ConnectButton
      shouldReconnect={isReconnect}
      type={type}
      avatarUrl={platformUser?.platformUserData?.avatar}
      username={platformUser?.platformUserData?.username}
      isConnected={!!platformUser}
    />
  )
})

const EmailAddress = () => {
  const { emails } = useUser()

  return (
    <ConnectButton
      type={"EMAIL"}
      username={emails?.emailAddress}
      isConnected={!!emails && !emails.pending}
      ConnectButton={<ConnectEmail />}
      DisconnectButton={<DisconnectEmail />}
    />
  )
}

const ConnectButton = ({
  type,
  avatarUrl,
  username,
  isConnected,
  shouldReconnect,
  DisconnectButton,
  ConnectButton: PropConnectButton,
}: {
  type: PlatformName
  avatarUrl?: string
  username?: string
  isConnected?: boolean
  shouldReconnect?: boolean
  DisconnectButton?: ReactNode
  ConnectButton?: ReactNode
}) => {
  const { icon, name, colorScheme } = platforms[type]
  const circleBorderColor = useColorModeValue("gray.100", "gray.700")

  return (
    <MotionHStack layout spacing={3} alignItems="center" w="full">
      {!!avatarUrl ? (
        <Avatar src={avatarUrl} size="sm" boxSize={7}>
          <AvatarBadge
            boxSize={5}
            bgColor={`${colorScheme}.500`}
            borderWidth={1}
            borderColor={circleBorderColor}
          >
            <Icon as={icon} boxSize={3} color="white" />
          </AvatarBadge>
        </Avatar>
      ) : (
        <Avatar
          icon={<Icon as={icon} boxSize={4} color="white" />}
          boxSize={7}
          bgColor={`${colorScheme}.500`}
        />
      )}
      <Text fontWeight="bold" flex="1" noOfLines={1} fontSize="sm">
        {username ?? `${platforms[type].name} ${isConnected ? "connected" : ""}`}
        {type === "TWITTER_V1" ? (
          <Text color={"gray"} display={"inline"}>
            {" "}
            (v1)
          </Text>
        ) : null}
      </Text>
      {type === "TWITTER_V1" ? <TwitterV1Tooltip /> : null}
      {!isConnected ? (
        PropConnectButton ?? <ConnectPlatform type={type} />
      ) : (
        <HStack spacing="1">
          {shouldReconnect && <ConnectPlatform type={type} isReconnect />}
          {DisconnectButton ?? <DisconnectPlatform type={type} name={name} />}
        </HStack>
      )}
    </MotionHStack>
  )
}

export const TwitterV1Tooltip = () => (
  <Tooltip
    hasArrow
    placement="top"
    label="Some of our Twitter requirements can only be checked if your Twitter account is connected this way as well"
  >
    <Icon color="gray" as={Question} />
  </Tooltip>
)

const ConnectPlatform = ({ type, isReconnect = false }) => {
  const toast = useToast()
  const { mutate: mutateAccesses } = useAccess()

  const onSuccess = () => {
    toast({
      title: `Account successfully connected`,
      status: "success",
    })
    mutateAccesses()
  }

  const { onConnect, isLoading, response } = useConnectPlatform(
    type as PlatformName,
    onSuccess,
    isReconnect
  )

  return (
    <Button
      isLoading={isLoading}
      onClick={onConnect}
      isDisabled={response}
      colorScheme={isReconnect ? "orange" : platforms[type].colorScheme}
      variant={isReconnect ? "subtle" : "solid"}
      size="sm"
    >
      {isReconnect ? "Reconnect" : "Connect"}
    </Button>
  )
}

const ConnectEmail = () => {
  const { emails } = useUser()
  const { emailModal } = useWeb3ConnectionManager()

  return (
    <Button
      isLoading={emailModal.isOpen}
      onClick={emailModal.onOpen}
      colorScheme={emails?.pending ? "orange" : platforms.EMAIL.colorScheme}
      variant={"solid"}
      size="sm"
    >
      {emails?.pending ? "Verify" : "Connect"}
    </Button>
  )
}

const DisconnectEmail = () => {
  const disclosure = useDisclosure()
  const { emails } = useUser()

  const { onSubmit, isLoading, signLoadingText } = useDisconnectEmail(
    disclosure.onClose
  )
  const onConfirm = () => onSubmit(emails?.emailAddress)
  const loadingText = signLoadingText ?? "Removing"

  return (
    <DisconnectButton
      name={platforms.EMAIL.name}
      {...{ disclosure, isLoading, loadingText, onConfirm }}
    />
  )
}

type Disclosure = ReturnType<typeof useDisclosure>

const DisconnectPlatform = ({ type, name }) => {
  const disclosure = useDisclosure()

  const { onSubmit, isLoading, signLoadingText } = useDisconnect(disclosure.onClose)
  const onConfirm = () => onSubmit({ platformName: type })
  const loadingText = signLoadingText ?? "Removing"

  return (
    <DisconnectButton {...{ disclosure, isLoading, loadingText, onConfirm, name }} />
  )
}

const DisconnectButton = ({
  onConfirm,
  isLoading,
  loadingText,
  name,
  disclosure: { isOpen, onClose, onOpen },
}: {
  onConfirm: () => void
  isLoading: boolean
  loadingText: PathString
  disclosure: Disclosure
  name: string
}) => {
  const alertCancelRef = useRef()

  return (
    <>
      <Tooltip label="Disconnect account" placement="top" hasArrow>
        <IconButton
          rounded="full"
          variant="ghost"
          size="sm"
          icon={<Icon as={LinkBreak} />}
          colorScheme="red"
          onClick={onOpen}
          aria-label="Disconnect account"
        />
      </Tooltip>
      <Alert {...{ isOpen, onClose }} leastDestructiveRef={alertCancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{`Disconnect ${name} account`}</AlertDialogHeader>

            <AlertDialogBody>
              {`Are you sure? This account will lose every Guild gated access on ${name}.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={alertCancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={onConfirm}
                isLoading={isLoading}
                loadingText={loadingText}
                ml={3}
              >
                Disconnect
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </>
  )
}

export { EmailAddress }
export default SocialAccount
