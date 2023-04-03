import {
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { Chain, Chains } from "connectors"
import { ImageSquare } from "phosphor-react"
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
import InfoModal from "./components/InfoModal"
import TransactionLink from "./components/InfoModal/components/TransactionLink"
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

  return (
    <>
      <Button
        colorScheme="blue"
        size="sm"
        leftIcon={<Icon as={ImageSquare} />}
        borderRadius="lg"
        fontWeight="medium"
        onClick={onOpen}
        data-dd-action-name="Mint Credential"
      >
        Mint Credential
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

      <InfoModal
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
