import { HStack, Text } from "@chakra-ui/react"
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
import { PropsWithChildren, createContext, useContext, useEffect } from "react"
import { GuildPlatform } from "types"
import { Chain, Chains } from "wagmiConfig/chains"
import useGuildRewardNftBalanceByUserId from "../hooks/useGuildRewardNftBalanceByUserId"
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
  const { data: nftBalance } = useGuildRewardNftBalanceByUserId({
    nftAddress,
    chainId: Chains[chain],
  })

  const { name, mintableAmountPerUser } = useNftDetails(chain, nftAddress)
  const alreadyCollected = nftBalance >= mintableAmountPerUser

  const { txHash, isTxModalOpen, onTxModalOpen, assetAmount } =
    useTransactionStatusContext()
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
        successText={`Successfully collected NFT${assetAmount > 1 ? "s" : ""}!`}
        successLinkComponent={<OpenseaLink />}
        errorComponent={
          <Text mb={4}>{`Couldn't collect NFT${assetAmount > 1 ? "s" : ""}`}</Text>
        }
        progressComponent={
          <>
            <Text fontWeight="bold" mb="2">
              You'll get:
            </Text>
            <RewardDisplay
              icon={
                <RewardIcon
                  guildPlatform={guildPlatform}
                  rolePlatformId={rolePlatformId}
                />
              }
              label={
                assetAmount > 1 ? (
                  name
                ) : (
                  <HStack>
                    <Text as="span">{name}</Text>
                    <Text
                      as="span"
                      colorScheme="gray"
                      fontWeight="semibold"
                    >{` x${assetAmount}`}</Text>
                  </HStack>
                )
              }
            />
          </>
        }
        successComponent={
          <>
            <Text fontWeight="bold" mb="2">
              {`Your new asset${assetAmount > 1 ? "s" : 0}:`}
            </Text>
            <RewardDisplay
              icon={
                <RewardIcon
                  guildPlatform={guildPlatform}
                  rolePlatformId={rolePlatformId}
                />
              }
              label={
                assetAmount > 1 ? (
                  name
                ) : (
                  <HStack>
                    <Text as="span">{name}</Text>
                    <Text
                      as="span"
                      colorScheme="gray"
                      fontWeight="semibold"
                    >{` x${assetAmount}`}</Text>
                  </HStack>
                )
              }
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
