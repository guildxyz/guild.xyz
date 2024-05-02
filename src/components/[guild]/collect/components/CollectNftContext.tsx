import { Text } from "@chakra-ui/react"
import {
  TransactionStatusProvider,
  useTransactionStatusContext,
} from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusContext"
import TransactionStatusModal from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal"
import OpenseaLink from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal/components/OpenseaLink"
import {
  RewardDisplay,
  RewardIcon,
} from "components/[guild]/RoleCard/components/Reward"
import useNftBalance from "hooks/useNftBalance"
import { PropsWithChildren, createContext, useContext, useEffect } from "react"
import { GuildPlatform } from "types"
import { Chain, Chains } from "wagmiConfig/chains"
import useNftDetails from "../hooks/useNftDetails"

type Props = {
  roleId: number
  rolePlatformId: number
  guildPlatform: GuildPlatform
  chain: Chain
  nftAddress: `0x${string}`
  alreadyCollected: boolean
}

const CollectNftContext = createContext<Props>(undefined)

const CollectNftProvider = ({
  roleId,
  rolePlatformId,
  guildPlatform,
  chain,
  nftAddress,
  children,
}: PropsWithChildren<Omit<Props, "alreadyCollected">>) => {
  // TODO: use `hasTheUserIdClaimed` instead of `balanceOf`, so it shows `Already claimed` for other addresses of the user too
  const { data: nftBalance } = useNftBalance({
    nftAddress,
    chainId: Chains[chain],
  })
  const alreadyCollected = nftBalance > 0

  const { name } = useNftDetails(chain, nftAddress)

  const { txHash, isTxModalOpen, onTxModalOpen } = useTransactionStatusContext()
  useEffect(() => {
    if (!txHash || isTxModalOpen) return
    onTxModalOpen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txHash])

  return (
    <CollectNftContext.Provider
      value={{
        roleId,
        rolePlatformId,
        guildPlatform,
        chain,
        nftAddress,
        alreadyCollected,
      }}
    >
      {children}

      <TransactionStatusModal
        title="Collect NFT"
        successTitle="Success"
        successText="Successfully collected NFT!"
        successLinkComponent={<OpenseaLink />}
        errorComponent={<Text mb={4}>Couldn't collect NFT</Text>}
        progressComponent={
          <>
            <Text fontWeight={"bold"} mb="2">
              You'll get:
            </Text>
            <RewardDisplay
              icon={
                <RewardIcon
                  guildPlatform={guildPlatform}
                  rolePlatformId={rolePlatformId}
                />
              }
              label={name}
            />
          </>
        }
        successComponent={
          <>
            <Text fontWeight={"bold"} mb="2">
              Your new asset:
            </Text>
            <RewardDisplay
              icon={
                <RewardIcon
                  guildPlatform={guildPlatform}
                  rolePlatformId={rolePlatformId}
                />
              }
              label={name}
            />
          </>
        }
      />
    </CollectNftContext.Provider>
  )
}

const CollectNftProviderWrapper = ({
  children,
  ...props
}: PropsWithChildren<Omit<Props, "alreadyCollected">>) => (
  <TransactionStatusProvider>
    <CollectNftProvider {...props}>{children}</CollectNftProvider>
  </TransactionStatusProvider>
)

const useCollectNftContext = () => useContext(CollectNftContext)

export { CollectNftProviderWrapper as CollectNftProvider, useCollectNftContext }
