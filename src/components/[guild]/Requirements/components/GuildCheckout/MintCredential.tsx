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
import MintCredentialButton from "./components/buttons/MintCredentialButton"
import CredentialFees from "./components/CredentialFees"
import CredentialImage from "./components/CredentialImage"
import CredentialReward from "./components/CredentialReward"
import MintCredentialChainPicker from "./components/MintCredentialChainPicker"
import TransactionStatusModal from "./components/TransactionStatusModal"
import OpenseaLink from "./components/TransactionStatusModal/components/OpenseaLink"
import { useMintCredentialContext } from "./MintCredentialContext"

type Props = {
  isSetup?: boolean
}

const MintCredential = ({ isSetup }: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const { isOpen, onOpen, onClose, isInvalidImage, isTooSmallImage } =
    useMintCredentialContext()

  const { colorMode } = useColorMode()

  return (
    <>
      <Button
        onClick={() => {
          onOpen()
          captureEvent("Click: Mint Credential (GuildCredentialRewardCard)", {
            guild: urlName,
          })
        }}
        data-dd-action-name="Mint Credential"
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
        {isSetup ? "Setup Credential" : "Mint Credential"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4} pr={16}>
            <Text as="span" mr={2}>
              Mint Credential
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
                    Credential
                  </AlertDescription>
                </Stack>
              </Alert>
            )}
            <CredentialImage />
          </ModalBody>

          <ModalFooter flexDir="column">
            <Stack w="full" spacing={6}>
              <MintCredentialChainPicker />
              <CredentialFees />
              <MintCredentialButton />
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TransactionStatusModal
        title="Mint Credential"
        successTitle="Successful mint"
        successText="Successful transaction! Your Guild Credential NFT is now on chain!"
        successLinkComponent={<OpenseaLink />}
        errorComponent={<Text mb={4}>Couldn't mint credential</Text>}
        progressComponent={
          <>
            <Text fontWeight={"bold"} mb="2">
              You'll get:
            </Text>
            <CredentialReward />
          </>
        }
        successComponent={
          <>
            <Text fontWeight={"bold"} mb="2">
              Your new asset:
            </Text>
            <CredentialReward />
          </>
        }
      />
    </>
  )
}

export default MintCredential
