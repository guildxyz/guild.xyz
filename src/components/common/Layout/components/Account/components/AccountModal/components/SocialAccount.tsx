import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  AvatarBadge,
  ChakraProps,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useAccess from "components/[guild]/hooks/useAccess"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import { motion } from "framer-motion"
import useToast from "hooks/useToast"
import { IconProps, LinkBreak } from "phosphor-react"
import platforms from "platforms/platforms"
import { useRef } from "react"
import { PlatformName } from "types"
import useDisconnect from "../hooks/useDisconnect"

type Props = {
  type: PlatformName
  icon: (props: IconProps) => JSX.Element
  colorScheme: ChakraProps["color"]
  name: string
}

const MotionHStack = motion(HStack)

const SocialAccount = ({ type, icon, name, colorScheme }: Props): JSX.Element => {
  const circleBorderColor = useColorModeValue("gray.100", "gray.800")
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
          errorType === "PLATFORM_CONNECT_INVALID" && subType === type
      )
    )

  return (
    <>
      <MotionHStack
        layout
        spacing={3}
        alignItems="center"
        w="full"
        order={!platformUser && "1"}
      >
        {!platformUser ? (
          <Avatar
            icon={<Icon as={icon} boxSize={4} color="white" />}
            boxSize={8}
            bgColor={`${colorScheme}.500`}
          />
        ) : (
          <Avatar src={platformUser.platformUserData?.avatar} size="sm">
            <AvatarBadge
              boxSize={5}
              bgColor={`${colorScheme}.500`}
              borderWidth={1}
              borderColor={circleBorderColor}
            >
              <Icon as={icon} boxSize={3} color="white" />
            </AvatarBadge>
          </Avatar>
        )}
        <Text fontWeight="semibold">
          {platformUser?.platformUserData?.username ??
            `${platforms[type].name} ${!!platformUser ? "connected" : ""}`}
        </Text>
        {!platformUser || isReconnect ? (
          <ConnectPlatform
            type={type}
            colorScheme={colorScheme}
            isReconnect={isReconnect}
          />
        ) : (
          <DisconnectPlatform type={type} name={name} />
        )}
      </MotionHStack>
    </>
  )
}

const ConnectPlatform = ({ type, colorScheme, isReconnect }) => {
  const toast = useToast()

  const onSuccess = () => {
    toast({
      title: `Account Connected!`,
      status: "success",
    })
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
      colorScheme={isReconnect ? "orange" : colorScheme}
      variant={isReconnect ? "subtle" : "solid"}
      size="sm"
      ml="auto !important"
    >
      {isReconnect ? "Reconnect" : "Connect"}
    </Button>
  )
}

const DisconnectPlatform = ({ type, name }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const alertCancelRef = useRef()

  const { onSubmit, isLoading, signLoadingText } = useDisconnect(onClose)
  const disconnectAccount = () => onSubmit({ platformName: type })

  return (
    <>
      <Tooltip label="Disconnect account" placement="top" hasArrow>
        <IconButton
          rounded="full"
          variant="ghost"
          size="sm"
          icon={<Icon as={LinkBreak} />}
          colorScheme="red"
          ml="auto !important"
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
                onClick={disconnectAccount}
                isLoading={isLoading}
                loadingText={signLoadingText || "Removing"}
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

export default SocialAccount
