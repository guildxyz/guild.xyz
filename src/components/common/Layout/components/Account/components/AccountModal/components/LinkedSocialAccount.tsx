import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  AvatarBadge,
  Collapse,
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
import { LinkBreak } from "phosphor-react"
import platforms from "platforms"
import { useEffect, useRef } from "react"
import { PlatformName } from "types"
import useDisconnect from "../hooks/useDisconnect"

type Props = {
  name: string
  image?: string
  type: PlatformName
}

const LinkedSocialAccount = ({ name, image, type }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenRow,
    onOpen: onOpenRow,
    onClose: onCloseRow,
  } = useDisclosure()
  useEffect(() => onOpenRow(), [name])

  const alertCancelRef = useRef()
  const close = () => {
    onClose()
    onCloseRow()
  }
  const { onSubmit, isLoading, signLoadingText } = useDisconnect(close)

  const circleBorderColor = useColorModeValue("gray.100", "gray.800")

  const disconnectAccount = () => onSubmit({ platformName: type })

  return (
    <>
      <Collapse in={isOpenRow} animateOpacity style={{ overflow: "unset" }}>
        <HStack spacing={3} alignItems="center" w="full">
          <Avatar src={image} size="sm">
            <AvatarBadge
              boxSize={5}
              bgColor={`${platforms[type]?.colorScheme}.500`}
              borderWidth={1}
              borderColor={circleBorderColor}
            >
              <Icon as={platforms[type]?.icon} boxSize={3} color="white" />
            </AvatarBadge>
          </Avatar>
          <Text fontWeight="semibold">{name}</Text>
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
        </HStack>
      </Collapse>

      <Alert {...{ isOpen, onClose }} leastDestructiveRef={alertCancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{`Disconnect ${platforms[type]?.name} account`}</AlertDialogHeader>

            <AlertDialogBody>
              {`Are you sure? This account will lose every Guild gated access on ${platforms[type]?.name}.`}
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

export default LinkedSocialAccount
