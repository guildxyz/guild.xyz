import {
  ButtonGroup,
  Center,
  Divider,
  HStack,
  Icon,
  Img,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import GuildAvatar from "components/common/GuildAvatar"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains, RPC } from "connectors"
import useKeyPair from "hooks/useKeyPair"
import useVaults from "hooks/useVaults"
import Image from "next/image"
import { LinkBreak, SignIn } from "phosphor-react"
import { useEffect, useState } from "react"
import shortenHex from "utils/shortenHex"
import AccountButton from "./components/AccountButton"

const Account = (): JSX.Element => {
  const { account, chainId } = useWeb3React()
  const { openWalletSelectorModal, openNetworkModal, openAccountModal, triedEager } =
    useWeb3ConnectionManager()
  const { ENSName } = useWeb3React()
  const { addresses, id } = useUser()

  const [isDismissed, setIsDismissed] = useState<boolean>(true)
  useEffect(() => {
    if (typeof id !== "number") {
      return
    }
    setIsDismissed(!!window.localStorage.getItem(`isDelegateDismissed_${id}`))
  }, [id])

  const vaults = useVaults()
  const { set } = useKeyPair()

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
    <Popover isOpen={!isDismissed && vaults && vaults.length > 0}>
      <PopoverTrigger>
        <ButtonGroup
          isAttached
          variant="ghost"
          alignItems="center"
          borderRadius={"2xl"}
        >
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
             * Space 11 is added to the theme by us and Chakra doesn't recognize it
             * just by "11" for some reason
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
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>
          <HStack>
            <Image
              width={20}
              height={20}
              alt="Delegate.cash logo"
              src="/walletLogos/delegatecash.png"
            />
            <Text>Delegate.cash</Text>
          </HStack>
        </PopoverHeader>
        <PopoverBody>
          <VStack alignItems={"end"}>
            <Text>
              You have {vaults?.length === 1 ? "an" : vaults?.length} unlinked vault
              {vaults?.length === 1 ? "" : "s"}. Link{" "}
              {vaults?.length === 1 ? "it" : "them"} to gain accesses for vault
              assets!
            </Text>
            <HStack>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.localStorage.setItem(`isDelegateDismissed_${id}`, "true")
                  setIsDismissed(true)
                }}
              >
                Dismiss
              </Button>
              <Button
                isLoading={set.isLoading || set.isSigning}
                loadingText={"Loading"}
                size="sm"
                onClick={() => {
                  set.onSubmit(false, true)
                }}
              >
                Link vault{vaults?.length === 1 ? "" : "s"}
              </Button>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default Account
