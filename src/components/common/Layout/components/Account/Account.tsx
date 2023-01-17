import {
  ButtonGroup,
  Center,
  Divider,
  HStack,
  Icon,
  Img,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import GuildAvatar from "components/common/GuildAvatar"
import useUser from "components/[guild]/hooks/useUser"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { Chains, RPC } from "connectors"
import { LinkBreak, SignIn } from "phosphor-react"
import { useContext } from "react"
import shortenHex from "utils/shortenHex"
import AccountButton from "./components/AccountButton"

const Account = (): JSX.Element => {
  const { account, chainId } = useWeb3React()
  const { openWalletSelectorModal, openNetworkModal, openAccountModal, triedEager } =
    useContext(Web3Connection)
  const { ENSName } = useWeb3React()
  const { addresses } = useUser()

  if (!account) {
    return (
      <AccountButton
        leftIcon={<SignIn />}
        isLoading={!triedEager}
        onClick={openWalletSelectorModal}
      >
        Connect to a wallet
      </AccountButton>
    )
  }

  const linkedAddressesCount = (addresses?.length ?? 1) - 1

  return (
    <ButtonGroup isAttached variant="ghost" alignItems="center" borderRadius={"2xl"}>
      <AccountButton onClick={openNetworkModal}>
        <Tooltip label={RPC[Chains[chainId]]?.chainName ?? "Unsupported chain"}>
          {RPC[Chains[chainId]]?.iconUrls?.[0] ? (
            <Img src={RPC[Chains[chainId]].iconUrls[0]} boxSize={4} />
          ) : (
            <Center>
              <Icon as={LinkBreak} />
            </Center>
          )}
        </Tooltip>
      </AccountButton>
      <Divider
        orientation="vertical"
        borderColor="whiteAlpha.300"
        /**
         * Space 11 is added to the theme by us and Chakra doesn't recognize it just
         * by "11" for some reason
         */
        h="var(--chakra-space-11)"
      />
      <AccountButton onClick={openAccountModal}>
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
  )
}

export default Account
