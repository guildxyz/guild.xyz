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
import AlphaTag from "./components/AlphaTag"
import MintCredentialButton from "./components/buttons/MintCredentialButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"
import CredentialImage from "./components/CredentialImage"
import {
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "./components/GuildCheckoutContex"
import TransactionStatusModal from "./components/TransactionStatusModal"
import {
  GuildAction,
  MintCredentialProvider,
  useMintCredentialContext,
} from "./MintCredentialContext"

type Props = {
  credentialChain: Chain
  credentialType: GuildAction
}

const MintCredential = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useGuildCheckoutContext()
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
        Mint Credential
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
            <CredentialImage />
          </ModalBody>

          <ModalFooter flexDir="column">
            <Stack w="full">
              <SwitchNetworkButton targetChainId={Chains[credentialChain]} />
              <MintCredentialButton />
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TransactionStatusModal
        title="Mint Credential"
        successTitle="Successful mint"
        successText="Successful transaction! You'll receive your Guild Credential NFT soon!"
        errorComponent={<Text mb={4}>Couldn't mint credential</Text>}
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
