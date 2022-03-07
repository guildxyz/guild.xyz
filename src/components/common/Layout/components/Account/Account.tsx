import {
  ButtonGroup,
  Divider,
  HStack,
  Image,
  Img,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import GuildAvatar from "components/common/GuildAvatar"
import useUser from "components/[guild]/hooks/useUser"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { Chains, RPC } from "connectors"
import { LinkBreak } from "phosphor-react"
import { useContext } from "react"
import shortenHex from "utils/shortenHex"
import AccountButton from "./components/AccountButton"
import AccountCard from "./components/AccountCard"
import AccountModal from "./components/AccountModal"
import NetworkModal from "./components/NetworkModal"
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
  const {
    isOpen: isNetworkModalOpen,
    onOpen: onNetworkModalOpen,
    onClose: onNetworkModalClose,
  } = useDisclosure()
  const { linkedAddressesCount } = useUser()

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
  if (!account) {
    return (
      <AccountButton
        width={200}
        isLoading={!triedEager}
        onClick={openWalletSelectorModal}
      >
        <Image alt="connect" width="200" height="58" src="assets/connect.png" />
      </AccountButton>
    )
  }
  return (
    <AccountCard>
      <ButtonGroup isAttached variant="ghost" alignItems="center">
        <AccountButton onClick={onNetworkModalOpen}>
          <Tooltip label={RPC[Chains[chainId]].chainName}>
            <Img src={RPC[Chains[chainId]].iconUrls[0]} boxSize={4} />
          </Tooltip>
        </AccountButton>
        <Divider
          orientation="vertical"
          borderColor="whiteAlpha.300"
          /**
           * Space 11 is added to the theme by us and Chakra doesn't recognize it
           * just by "11" for some reason
           */
          h="var(--chakra-space-11)"
        />
        <AccountButton onClick={onAccountModalOpen}>
          <HStack spacing={3}>
            <VStack spacing={0} alignItems="flex-end">
              <Text
                as="span"
                fontSize={linkedAddressesCount ? "sm" : "md"}
                fontWeight={linkedAddressesCount ? "bold" : "semibold"}
              >
                {ENSName || `${shortenHex(account, 3)}`}
              </Text>
              {linkedAddressesCount && (
                <Text
                  as="span"
                  fontSize="xs"
                  fontWeight="medium"
                  color="whiteAlpha.600"
                >
                  {`+ ${linkedAddressesCount} address${
                    linkedAddressesCount > 1 ? "es" : ""
                  }`}
                </Text>
              )}
            </VStack>
            <GuildAvatar address={account} size={4} />
          </HStack>
        </AccountButton>
      </ButtonGroup>

      <AccountModal isOpen={isAccountModalOpen} onClose={onAccountModalClose} />
      <NetworkModal isOpen={isNetworkModalOpen} onClose={onNetworkModalClose} />
    </AccountCard>
  )
}

export default Account
