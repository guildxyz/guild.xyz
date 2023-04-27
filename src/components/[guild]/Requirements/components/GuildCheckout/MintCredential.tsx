import {
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
import { Chain, Chains } from "connectors"
import {
  GuildAction,
  MintCredentialProvider,
  useMintCredentialContext,
} from "./MintCredentialContext"
import AlphaTag from "./components/AlphaTag"
import CredentialFeeCurrency from "./components/CredentialFeeCurrency"
import CredentialImage from "./components/CredentialImage"
import {
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "./components/GuildCheckoutContex"
import TransactionStatusModal from "./components/TransactionStatusModal"
import TransactionLink from "./components/TransactionStatusModal/components/TransactionLink"
import MintCredentialButton from "./components/buttons/MintCredentialButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"

type Props = {
  credentialChain: Chain
  credentialType: GuildAction
}

const MintCredential = (): JSX.Element => {
  const { isOpen, onOpen, onClose, txError, txSuccess, txHash } =
    useGuildCheckoutContext()
  const { credentialChain } = useMintCredentialContext()

  const { colorMode } = useColorMode()

  return (
    <>
      <Button
        onClick={onOpen}
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
        Mint NFT
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="duotone">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4} pr={16}>
            <Text as="span" mr={2}>
              Mint Credential
            </Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CredentialImage />
          </ModalBody>

          <ModalFooter pt={10} flexDir="column">
            <Stack spacing={8} w="full">
              <CredentialFeeCurrency />

              <Stack spacing={2}>
                <SwitchNetworkButton targetChainId={Chains[credentialChain]} />
                <MintCredentialButton />
              </Stack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* TODO: extract this to its own component */}
      <TransactionStatusModal
        title={
          txError
            ? "Transaction failed"
            : txSuccess
            ? "Success"
            : txHash
            ? "Transaction is processing..."
            : "Mint Credential"
        }
        progressComponent={
          <>
            <Text mb={4}>
              The blockchain is working its magic... Your transaction should be
              confirmed shortly
            </Text>

            <TransactionLink />
          </>
        }
        successComponent={
          <>
            <Text mb={4}>
              Successful transaction! You'll receive your Guild Credential NFT soon!
            </Text>

            <TransactionLink />
          </>
        }
        errorComponent={
          <>
            <Text mb={4}>Couldn't mint credential</Text>
          </>
        }
      />
    </>
  )
}

const MintCredentialWrapper = ({ credentialChain, credentialType }: Props) => (
  <GuildCheckoutProvider>
    <MintCredentialProvider
      credentialChain={credentialChain}
      credentialType={credentialType}
    >
      <MintCredential />
    </MintCredentialProvider>
  </GuildCheckoutProvider>
)

export default MintCredentialWrapper
