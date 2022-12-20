import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Circle,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Alert } from "components/common/Modal"
import { LinkBreak } from "phosphor-react"
import { useRef } from "react"
import shortenHex from "utils/shortenHex"
import useDisconnect from "../hooks/useDisconnect"

type Props = {
  address: string
}

const LinkedAddress = ({ address }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { onSubmit, isLoading, signLoadingText } = useDisconnect(onClose)
  const alertCancelRef = useRef()

  const removeAddress = () => onSubmit({ address })

  return (
    <>
      <HStack spacing={4} alignItems="center" w="full">
        <Circle size={8}>
          <GuildAvatar address={address} size={6} />
        </Circle>
        <CopyableAddress address={address} decimals={5} fontSize="md" />
        <Tooltip label="Disconnect address" placement="top" hasArrow>
          <IconButton
            rounded="full"
            variant="ghost"
            size="sm"
            icon={<Icon as={LinkBreak} />}
            colorScheme="red"
            ml="auto !important"
            onClick={onOpen}
            aria-label="Disconnect address"
          />
        </Tooltip>
      </HStack>
      <Alert {...{ isOpen, onClose }} leastDestructiveRef={alertCancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Disconnect address</AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You'll be kicked from the guilds you have the
              requirement(s) to with{" "}
              <Text as="span" fontWeight="semibold" whiteSpace="nowrap">
                {shortenHex(address, 3)}
              </Text>
              .
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={alertCancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={removeAddress}
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

export default LinkedAddress
