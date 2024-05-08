import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Circle,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  SkeletonCircle,
  Spinner,
  Tag,
  Text,
  Tooltip,
  Wrap,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Alert } from "components/common/Modal"
import Image from "next/image"
import { DotsThree, LinkBreak, UserSwitch } from "phosphor-react"
import { useRef } from "react"
import { User } from "types"
import shortenHex from "utils/shortenHex"
import { useDisconnectAddress } from "../hooks/useDisconnect"
import useEditPrimaryAddress from "../hooks/useEditPrimaryAddress"
import AddressTypeTag from "./AddressTypeTag"
import PrimaryAddressTag from "./PrimaryAddressTag"

type Props = {
  addressData: User["addresses"][number]
}

const LinkedAddress = ({ addressData }: Props) => {
  const { address, isDelegated, isPrimary, walletType } = addressData ?? {}
  const { address: connectedAddress } = useWeb3ConnectionManager()

  const isCurrent = address?.toLowerCase() === connectedAddress.toLowerCase()

  const {
    onSubmit: onEditPrimaryAddressSubmit,
    isLoading: isEditPrimaryAddressLoading,
  } = useEditPrimaryAddress()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    onSubmit: onDisconnectSubmit,
    isLoading: isDisconnectLoading,
    signLoadingText: disconnectSignLoadingText,
  } = useDisconnectAddress(onClose)
  const alertCancelRef = useRef()

  const removeAddress = () => onDisconnectSubmit({ address })
  const removeMenuItemColor = useColorModeValue("red.600", "red.300")

  return (
    <>
      <HStack spacing={2} alignItems="center" w="full">
        <Circle size={7}>
          <GuildAvatar address={address} size={4} mt="-1" />
        </Circle>
        <Wrap spacingY={0} spacingX={1}>
          <CopyableAddress
            address={address}
            decimals={5}
            fontSize="sm"
            fontWeight="bold"
            mr={0.5}
          />
          {isDelegated && (
            <Tooltip label="Delegate.cash" placement="top">
              <Tag>
                <Image
                  width={15}
                  height={15}
                  src={`/walletLogos/delegatecash.png`}
                  alt="Delegate cash logo"
                />
              </Tag>
            </Tooltip>
          )}
          {walletType !== "EVM" && <AddressTypeTag type={walletType} size="sm" />}
          {isCurrent && (
            <Tag size="sm" colorScheme="blue">
              Current
            </Tag>
          )}
          {isPrimary && <PrimaryAddressTag size="sm" />}
        </Wrap>

        {/* Using a custom key here so the menu closes when we successfully set a new primary address */}
        <Menu key={`${address}${isPrimary ? "-primary" : ""}`} closeOnSelect={false}>
          <MenuButton
            as={IconButton}
            icon={<DotsThree />}
            aria-label="Options"
            rounded="full"
            variant="ghost"
            size="sm"
            ml="auto !important"
          />
          <MenuList minW="none">
            {!isPrimary && (
              <MenuItem
                isDisabled={isEditPrimaryAddressLoading}
                icon={
                  isEditPrimaryAddressLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    <UserSwitch />
                  )
                }
                onClick={() =>
                  onEditPrimaryAddressSubmit({
                    address,
                    isPrimary: true,
                  })
                }
              >
                Set as primary
              </MenuItem>
            )}
            <MenuItem
              icon={<LinkBreak />}
              color={removeMenuItemColor}
              onClick={onOpen}
            >
              Disconnect
            </MenuItem>
          </MenuList>
        </Menu>
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
                isLoading={isDisconnectLoading}
                loadingText={disconnectSignLoadingText || "Removing"}
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
