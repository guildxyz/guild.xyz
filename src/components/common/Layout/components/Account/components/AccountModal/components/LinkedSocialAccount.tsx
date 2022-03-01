import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Circle,
  HStack,
  Icon,
  IconButton,
  Img,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Alert } from "components/common/Modal"
import { DiscordLogo, LinkBreak, TelegramLogo } from "phosphor-react"
import { useEffect, useRef } from "react"
import { PlatformName } from "types"
import useUpdateUser from "../hooks/useUpdateUser"

type Props = {
  name: string
  image?: string
  type: PlatformName
}

const platformData = {
  TELEGRAM: {
    icon: TelegramLogo,
    name: "Telegram",
    color: "TELEGRAM.500",
    paramName: "telegramId",
  },
  DISCORD: {
    icon: DiscordLogo,
    name: "Discord",
    color: "DISCORD.500",
    paramName: "discordId",
  },
}

const LinkedSocialAccount = ({ name, image, type }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, response, isLoading, isSigning } = useUpdateUser()
  const alertCancelRef = useRef()

  const circleBorderColor = useColorModeValue("gray.100", "gray.800")

  const disconnectAccount = () => {
    const dataToUpdate: any = {
      [platformData[type].paramName]: null,
    }
    onSubmit({ ...dataToUpdate })
  }

  useEffect(() => {
    if (response) onClose()
  }, [response, onClose])

  return (
    <>
      <HStack spacing={4} alignItems="center" w="full">
        <Box position="relative" boxSize={8}>
          <Img boxSize={8} rounded="full" src={image} alt={name} />
          <Circle
            position="absolute"
            right={-1}
            bottom={-1}
            size={5}
            bgColor={platformData[type]?.color}
            borderWidth={1}
            borderColor={circleBorderColor}
          >
            <Icon as={platformData[type]?.icon} boxSize={3} />
          </Circle>
        </Box>
        <Text as="span" fontWeight="bold">
          {name}
        </Text>
        <Tooltip label="Disconnect" placement="top" hasArrow>
          <IconButton
            rounded="full"
            variant="ghost"
            size="sm"
            icon={<Icon as={LinkBreak} />}
            colorScheme="red"
            ml="auto !important"
            onClick={onOpen}
            aria-label="Remove address"
          />
        </Tooltip>
      </HStack>

      <Alert {...{ isOpen, onClose }} leastDestructiveRef={alertCancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Disconnect account</AlertDialogHeader>

            <AlertDialogBody>
              {`Are you sure? You'll be kicked from the guilds you have the
              requirement(s) to with your ${platformData[type]?.name} account.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={alertCancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={disconnectAccount}
                isLoading={isLoading}
                loadingText={isSigning ? "Check your wallet" : "Removing"}
                ml={3}
              >
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </>
  )
}

export default LinkedSocialAccount
