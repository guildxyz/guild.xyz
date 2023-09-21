import {
  Alert,
  AlertIcon,
  AlertTitle,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { useEditGuildDrawer } from "components/[guild]/EditGuild/EditGuildDrawerContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import AlphaTag from "./components/AlphaTag"
import MintGuildPinButton from "./components/buttons/MintGuildPinButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"
import GuildPinFees from "./components/GuildPinFees"
import GuildPinImage from "./components/GuildPinImage"
import GuildPinReward from "./components/GuildPinReward"
import TransactionStatusModal from "./components/TransactionStatusModal"
import OpenseaLink from "./components/TransactionStatusModal/components/OpenseaLink"
import { useMintGuildPinContext } from "./MintGuildPinContext"

const MintGuildPin = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName, guildPin } = useGuild()

  const {
    isOpen,
    onOpen,
    onClose,
    isInvalidImage,
    isTooSmallImage,
    isImageValidating,
    error,
  } = useMintGuildPinContext()
  const setupRequired = isInvalidImage || isTooSmallImage

  const { colorMode } = useColorMode()

  const { onOpen: onEditGuildDrawerOpen } = useEditGuildDrawer()

  return (
    <>
      <Button
        onClick={() => {
          onOpen()
          if (guildPin.isActive)
            captureEvent("Click: Mint Guild Pin (GuildPinRewardCard)", {
              guild: urlName,
            })
        }}
        variant="outline"
        borderColor={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
        {...(colorMode === "light"
          ? {
              _hover: {
                bg: "blackAlpha.50",
              },
              _active: {
                bg: "blackAlpha.200",
              },
            }
          : {})}
      >
        {setupRequired
          ? "Setup Guild Pin"
          : !guildPin.isActive
          ? "Activate Guild Pin"
          : "Mint Guild Pin"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4} pr={16}>
            <Text as="span" mr={2}>
              {setupRequired
                ? "Setup Guild Pin"
                : !guildPin.isActive
                ? "Activate Guild Pin"
                : "Mint Guild Pin"}
            </Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb="6">
            {!isImageValidating && (error || setupRequired) && (
              <Alert status="info" mb="6" pb="5">
                <AlertIcon />
                <Stack position="relative" top={1}>
                  <AlertTitle>
                    {error ??
                      "Please upload a bigger image in guild settings to activate Guild Pin"}
                  </AlertTitle>

                  <Button
                    size="sm"
                    w="max-content"
                    rightIcon={<ArrowSquareOut />}
                    onClick={onEditGuildDrawerOpen}
                    colorScheme="blue"
                    variant="link"
                  >
                    Open settings
                  </Button>
                </Stack>
              </Alert>
            )}
            <GuildPinImage />
          </ModalBody>

          <ModalFooter flexDir="column">
            {!guildPin.isActive || setupRequired ? (
              <Button
                size="lg"
                colorScheme="green"
                isDisabled={setupRequired}
                w="full"
              >
                {setupRequired ? "Setup required" : "Activate Guild Pin"}
              </Button>
            ) : (
              <Stack w="full" spacing={6}>
                <GuildPinFees />

                <Stack w="full" spacing={2}>
                  <SwitchNetworkButton targetChainId={Chains[guildPin.chain]} />
                  <MintGuildPinButton />
                </Stack>

                <Text colorScheme="gray" fontSize="sm">
                  This is a non-transferable token that has no financial value.
                </Text>
              </Stack>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TransactionStatusModal
        title="Mint Guild Pin"
        successTitle="Successful mint"
        successText="Successful transaction! Your Guild Pin NFT is now on chain!"
        successLinkComponent={<OpenseaLink />}
        errorComponent={<Text mb={4}>Couldn't mint Guild Pin</Text>}
        progressComponent={
          <>
            <Text fontWeight={"bold"} mb="2">
              You'll get:
            </Text>
            <GuildPinReward />
          </>
        }
        successComponent={
          <>
            <Text fontWeight={"bold"} mb="2">
              Your new asset:
            </Text>
            <GuildPinReward />
          </>
        }
      />
    </>
  )
}

export default MintGuildPin
