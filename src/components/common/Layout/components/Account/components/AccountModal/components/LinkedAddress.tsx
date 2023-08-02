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
import useIsV2 from "hooks/useIsV2"
import Image from "next/image"
import { LinkBreak } from "phosphor-react"
import { useRef } from "react"
import { AddressConnectionProvider, User } from "types"
import shortenHex from "utils/shortenHex"
import { useDisconnectAddress, useDisconnectV1 } from "../hooks/useDisconnect"
import PrimaryAddressTag from "./PrimaryAddressTag"

type Props = {
  addressData: User["addresses"][number]
}

const providerIcons: Record<AddressConnectionProvider, string> = {
  DELEGATE: "delegatecash.png",
}

const LinkedAddress = ({ addressData }: Props) => {
  const { address, provider, isPrimary } = addressData ?? {}
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isV2 = useIsV2()

  const { onSubmit, isLoading, signLoadingText } = useDisconnectV1(onClose)
  const {
    onSubmit: onSubmitV2,
    isLoading: isLoadingV2,
    signLoadingText: signLoadingTextV2,
  } = useDisconnectAddress(onClose)
  const alertCancelRef = useRef()

  const removeAddress = () => (isV2 ? onSubmitV2 : onSubmit)({ address })

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
        {isPrimary ? <PrimaryAddressTag size="sm" /> : null}
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
                isLoading={isLoading || isLoadingV2}
                loadingText={signLoadingText || signLoadingTextV2 || "Removing"}
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
