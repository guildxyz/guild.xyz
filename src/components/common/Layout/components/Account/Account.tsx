import {
  ButtonGroup,
  Divider,
  HStack,
  Text,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/[community]/Context"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { Chains, RPC } from "connectors"
import { LinkBreak, SignIn } from "phosphor-react"
import { useContext } from "react"
import shortenHex from "utils/shortenHex"
import AccountButton from "./components/AccountButton"
import AccountCard from "./components/AccountCard"
import AccountModal from "./components/AccountModal"
import Balance from "./components/Balance"
import Identicon from "./components/Identicon"
import NetworkModal from "./components/NetworkModal"
import useENSName from "./hooks/useENSName"

const Account = (): JSX.Element => {
  const communityData = useCommunity()
  const { error, account, chainId } = useWeb3React()
  const { openModal, triedEager } = useContext(Web3Connection)
  const ENSName = useENSName(account)
  const {
    isOpen: isAccountModalOpen,
    onOpen: onAccountModalOpen,
    onClose: onAccountModalClose,
  } = useDisclosure()
  const {
    isOpen: isNetworkModalOpen,
    onOpen: onNetworkModalOpen,
    onClose: onNetworkModalClose,
  } = useDisclosure()
  const { colorMode } = useColorMode()

  if (typeof window === "undefined") {
    return (
      <AccountCard>
        <AccountButton isLoading>Connect to a wallet</AccountButton>
      </AccountCard>
    )
  }

  if (
    error instanceof UnsupportedChainIdError ||
    (typeof chainId === "number" &&
      !!communityData &&
      chainId !== Chains[communityData.chainData.name])
  ) {
    return (
      <AccountCard>
        <AccountButton
          leftIcon={<LinkBreak />}
          colorScheme="red"
          onClick={onNetworkModalOpen}
        >
          Wrong Network
        </AccountButton>
        <NetworkModal isOpen={isNetworkModalOpen} onClose={onNetworkModalClose} />
      </AccountCard>
    )
  }
  if (typeof account !== "string") {
    return (
      <AccountCard>
        <AccountButton
          leftIcon={<SignIn />}
          isLoading={!triedEager}
          onClick={openModal}
        >
          Connect to a wallet
        </AccountButton>
      </AccountCard>
    )
  }
  return (
    <AccountCard>
      <ButtonGroup isAttached variant="ghost" alignItems="center">
        <AccountButton onClick={onNetworkModalOpen}>
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
              {!!communityData && <Balance token={communityData.chainData.token} />}
              <Text
                as="span"
                fontSize={communityData ? "xs" : "md"}
                fontWeight={communityData ? "medium" : "semibold"}
                color={
                  !!communityData &&
                  (colorMode === "light" ? "gray.600" : "gray.400")
                }
              >
                {ENSName || `${shortenHex(account, 3)}`}
              </Text>
            </VStack>
            <Identicon address={account} size={28} />
          </HStack>
        </AccountButton>
      </ButtonGroup>

      <AccountModal isOpen={isAccountModalOpen} onClose={onAccountModalClose} />
      <NetworkModal isOpen={isNetworkModalOpen} onClose={onNetworkModalClose} />
    </AccountCard>
  )
}

export default Account
