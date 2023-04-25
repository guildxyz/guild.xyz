import {
  HStack,
  Icon,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { WalletConnect } from "@web3-react/walletconnect-v2"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import { deleteKeyPairFromIdb } from "hooks/useKeyPair"
import { SignOut } from "phosphor-react"
import AccountConnections from "./components/AccountConnections"
import PrimaryAddressTag from "./components/PrimaryAddressTag"

const AccountModal = () => {
  const { account, connector } = useWeb3React()
  const {
    setIsDelegateConnection,
    isAccountModalOpen: isOpen,
    closeAccountModal: onClose,
  } = useWeb3ConnectionManager()
  const { id, addresses } = useUser()

  const connectorName = (c) =>
    c instanceof MetaMask
      ? typeof window !== "undefined" && (window.ethereum as any)?.isBraveWallet
        ? "Brave Wallet"
        : "MetaMask"
      : c instanceof WalletConnect
      ? "WalletConnect"
      : c instanceof CoinbaseWallet
      ? "Coinbase Wallet"
      : ""

  const handleLogout = () => {
    setIsDelegateConnection(false)
    onClose()
    connector.resetState()
    connector.deactivate?.()

    const keysToRemove = Object.keys({ ...window.localStorage }).filter((key) =>
      /^dc_auth_[a-z]*$/.test(key)
    )

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key)
    })

    deleteKeyPairFromIdb(id).catch(() => {})
  }

  const domain = useResolveAddress(account)

  return (
    <Modal isOpen={isOpen} onClose={onClose} colorScheme="duotone">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton />
        {account ? (
          <>
            <ModalBody>
              <Stack mb={9} direction="row" spacing="4" alignItems="center">
                <GuildAvatar address={account} />
                <CopyableAddress
                  address={account}
                  domain={domain}
                  decimals={5}
                  fontSize="2xl"
                />
                {addresses?.indexOf(account.toLowerCase()) === 0 &&
                addresses.length > 1 ? (
                  <PrimaryAddressTag />
                ) : null}
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb="-1"
              >
                <Text colorScheme="gray" fontSize="sm" fontWeight="medium">
                  {`Connected with ${connectorName(connector)}`}
                </Text>
                <HStack>
                  <Tooltip label="Disconnect">
                    <IconButton
                      size="sm"
                      variant="outline"
                      onClick={handleLogout}
                      icon={<Icon as={SignOut} p="1px" />}
                      aria-label="Disconnect"
                    />
                  </Tooltip>
                </HStack>
              </Stack>
            </ModalBody>
            <ModalFooter flexDir="column" pt="10">
              <AccountConnections />
            </ModalFooter>
          </>
        ) : (
          <ModalBody>
            <Text mb="6" fontSize={"2xl"} fontWeight="semibold">
              Not connected
            </Text>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AccountModal
