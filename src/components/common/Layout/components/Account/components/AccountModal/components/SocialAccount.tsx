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
import { motion } from "framer-motion"
import useToast from "hooks/useToast"
import { LinkBreak, Question } from "phosphor-react"
import platforms from "platforms/platforms"
import { memo, useRef } from "react"
import { PlatformName } from "types"
import useDisconnect from "../hooks/useDisconnect"

type Props = {
  type: PlatformName
}

const MotionHStack = motion(HStack)

const SocialAccount = memo(({ type }: Props): JSX.Element => {
  const { icon, name, colorScheme } = platforms[type]

  const circleBorderColor = useColorModeValue("gray.100", "gray.700")
  const { platformUsers } = useUser()
  const accesses = useAccess()
  const platformUser = platformUsers?.find(
    (platform) => platform.platformName.toString() === type
  )

  const isReconnect =
    !!accesses &&
    accesses?.data?.requirementErrors?.some(
      ({ errorType, subType }) =>
        errorType === "PLATFORM_CONNECT_INVALID" && subType?.toUpperCase() === type
    )

  return (
    <>
      <MotionHStack layout spacing={3} alignItems="center" w="full">
        {!platformUser ? (
          <Avatar
            icon={<Icon as={icon} boxSize={4} color="white" />}
            boxSize={7}
            bgColor={`${colorScheme}.500`}
          />
        ) : (
          <Avatar src={platformUser.platformUserData?.avatar} size="sm" boxSize={7}>
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
        <Text fontWeight="bold" flex="1" noOfLines={1} fontSize="sm">
          {platformUser?.platformUserData?.username ??
            `${platforms[type].name} ${!!platformUser ? "connected" : ""}`}
          {type === "TWITTER_V1" ? (
            <Text color={"gray"} display={"inline"}>
              {" "}
              (v1)
            </Text>
          ) : null}
        </Text>
        {type === "TWITTER_V1" ? <TwitterV1Tooltip /> : null}
        {!platformUser ? (
          <ConnectPlatform type={type} colorScheme={colorScheme} />
        ) : (
          <HStack spacing="1">
            {isReconnect && (
              <ConnectPlatform type={type} colorScheme={colorScheme} isReconnect />
            )}
            <DisconnectPlatform type={type} name={name} />
          </HStack>
        )}
      </MotionHStack>
    </>
  )
})

export const TwitterV1Tooltip = () => (
  <Tooltip
    hasArrow
    placement="top"
    label="Some of our Twitter requirements can only be checked if your Twitter account is connected this way as well"
  >
    <Icon color="gray" as={Question} />
  </Tooltip>
)

const ConnectPlatform = ({ type, colorScheme, isReconnect = false }) => {
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
      colorScheme={isReconnect ? "orange" : colorScheme}
      variant={isReconnect ? "subtle" : "solid"}
      size="sm"
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
