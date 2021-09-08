import {
  ButtonGroup,
  Divider,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { Chains, RPC } from "connectors"
import { LinkBreak, SignIn } from "phosphor-react"
import { useContext } from "react"
import shortenHex from "utils/shortenHex"
import AccountButton from "./components/AccountButton"
import AccountCard from "./components/AccountCard"
import AccountModal from "./components/AccountModal"
import Identicon from "./components/Identicon"
import useENSName from "./hooks/useENSName"

const Account = (): JSX.Element => {
  const { error, account, chainId } = useWeb3React()
  const { openWalletSelectorModal, triedEager, openNetworkModal } =
    useContext(Web3Connection)
  const ENSName = useENSName(account)
  const {
    isOpen: isAccountModalOpen,
    onOpen: onAccountModalOpen,
    onClose: onAccountModalClose,
  } = useDisclosure()

  if (typeof window === "undefined") {
    return (
      <AccountCard>
        <AccountButton isLoading>Connect to a wallet</AccountButton>
      </AccountCard>
    )
  }

  if (error instanceof UnsupportedChainIdError) {
    return (
      <AccountCard>
        <AccountButton
          leftIcon={<LinkBreak />}
          colorScheme="red"
          onClick={openNetworkModal}
        >
          Wrong Network
        </AccountButton>
      </AccountCard>
    )
  }
  if (typeof account !== "string") {
    return (
      <AccountCard>
        <AccountButton
          leftIcon={<SignIn />}
          isLoading={!triedEager}
          onClick={openWalletSelectorModal}
        >
          Connect to a wallet
        </AccountButton>
      </AccountCard>
    )
  }
  return (
    <AccountCard>
      <ButtonGroup isAttached variant="ghost" alignItems="center">
        <AccountButton onClick={openNetworkModal}>
          {RPC[Chains[chainId]].chainName}
        </AccountButton>
        <Divider
          orientation="vertical"
          /**
           * Space 11 is added to the theme by us and Chakra doesn't recognize it
           * just by "11" for some reason
           */
          h={{ base: 14, md: "var(--chakra-space-11)" }}
        />
        <AccountButton onClick={onAccountModalOpen}>
          <HStack>
            <VStack spacing={0} alignItems="flex-end">
              {/* <Balance token={token} /> */}
              <Text as="span" fontSize="md" fontWeight="semibold">
                {ENSName || `${shortenHex(account, 3)}`}
              </Text>
            </VStack>
            <Identicon address={account} size={28} />
          </HStack>
        </AccountButton>
      </ButtonGroup>

      <AccountModal isOpen={isAccountModalOpen} onClose={onAccountModalClose} />
    </AccountCard>
  )
}

export default Account
