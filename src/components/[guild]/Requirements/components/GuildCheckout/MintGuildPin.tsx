import {
  Alert,
  AlertDescription,
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
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import AlphaTag from "./components/AlphaTag"
import MintGuildPinButton from "./components/buttons/MintGuildPinButton"
import GuildPinFees from "./components/GuildPinFees"
import GuildPinImage from "./components/GuildPinImage"
import GuildPinReward from "./components/GuildPinReward"
import MintGuildPinChainPicker from "./components/MintGuildPinChainPicker"
import TransactionStatusModal from "./components/TransactionStatusModal"
import OpenseaLink from "./components/TransactionStatusModal/components/OpenseaLink"
import { useMintGuildPinContext } from "./MintGuildPinContext"

const MintGuildPin = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const { isOpen, onOpen, onClose, isInvalidImage, isTooSmallImage } =
    useMintGuildPinContext()

  const { colorMode } = useColorMode()

  return (
    <>
      <Button
        onClick={() => {
          onOpen()
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
        {isInvalidImage || isTooSmallImage ? "Setup Guild Pin" : "Mint Guild Pin"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4} pr={16}>
            <Text as="span" mr={2}>
              Mint Guild Pin
            </Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb="6">
            {(isInvalidImage || isTooSmallImage) && (
              <Alert status="error" mb="6" pb="5">
                <AlertIcon />
                <Stack position="relative" top={1}>
                  <AlertTitle>Image too small</AlertTitle>
                  <AlertDescription>
                    Please upload a bigger image in guild settings to activate Guild
                    Pin
                  </AlertDescription>
                </Stack>
              </Alert>
            )}
            <GuildPinImage />
          </ModalBody>

          <ModalFooter flexDir="column">
            <Stack w="full" spacing={6}>
              <MintGuildPinChainPicker />
              <GuildPinFees />
              <MintGuildPinButton />
              <Text colorScheme="gray" fontSize="sm">
                This is a non-transferable token that has no financial value.
              </Text>
            </Stack>
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
