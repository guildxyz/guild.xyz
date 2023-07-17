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
  Skeleton,
  SkeletonCircle,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Alert } from "components/common/Modal"
import useUser from "components/[guild]/hooks/useUser"
import Image from "next/image"
import { LinkBreak } from "phosphor-react"
import { useRef } from "react"
import { AddressConnectionProvider } from "types"
import shortenHex from "utils/shortenHex"
import useDisconnect from "../hooks/useDisconnect"
import PrimaryAddressTag from "./PrimaryAddressTag"

type Props = {
  address: string
}

const providerIcons: Record<AddressConnectionProvider, string> = {
  DELEGATE: "delegatecash.png",
}

const LinkedAddress = ({ address }: Props) => {
  const { addressProviders, addresses } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { onSubmit, isLoading, signLoadingText } = useDisconnect(onClose)
  const alertCancelRef = useRef()

  const removeAddress = () => onSubmit({ address })

  const provider = addressProviders?.[address]

  return (
    <>
      <HStack spacing={2} alignItems="center" w="full">
        <Circle size={7}>
          <GuildAvatar address={address} size={4} mt="-1" />
        </Circle>
        <CopyableAddress
          address={address}
          decimals={5}
          fontSize="sm"
          fontWeight="bold"
        />
        {provider && providerIcons[provider] && (
          <Tooltip label="Delegate.cash" placement="top">
            <Tag>
              <Image
                width={15}
                height={15}
                src={`/walletLogos/${providerIcons[provider]}`}
                alt="Delegate cash logo"
              />
            </Tag>
          </Tooltip>
        )}
        {addresses.indexOf(address) === 0 ? <PrimaryAddressTag size="sm" /> : null}
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

export const LinkedAddressSkeleton = () => (
  <HStack spacing={2} alignItems="center" w="full" py="0.5">
    <SkeletonCircle boxSize={7} />
    <Skeleton h="5" w="36" />
  </HStack>
)

export default LinkedAddress
