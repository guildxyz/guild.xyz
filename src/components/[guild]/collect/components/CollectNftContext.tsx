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
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import { PropsWithChildren, createContext, useContext, useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
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
  isLegacy: boolean
}

export type CollectNftForm = {
  amount: number
}

const CollectNftContext = createContext<Props>(undefined)

const CollectNftProvider = ({
  roleId,
  rolePlatformId,
  guildPlatform,
  chain,
  nftAddress,
  children,
}: PropsWithChildren<Omit<Props, "alreadyCollected" | "isLegacy">>) => {
  const { data: nftBalance } = useGuildRewardNftBalanceByUserId({
    nftAddress,
    chainId: Chains[chain],
  })

  const isLegacy =
    guildPlatform?.platformGuildData?.function ===
    ContractCallFunction.DEPRECATED_SIMPLE_CLAIM

  const { name, mintableAmountPerUser, maxSupply, totalSupply } = useNftDetails(
    chain,
    nftAddress
  )
  const alreadyCollected =
    !maxSupply && !mintableAmountPerUser
      ? false
      : mintableAmountPerUser > 0
      ? nftBalance >= mintableAmountPerUser || totalSupply >= maxSupply
      : totalSupply >= maxSupply

  const { txHash, isTxModalOpen, onTxModalOpen } = useTransactionStatusContext()
  useEffect(() => {
    if (!txHash || isTxModalOpen) return
    onTxModalOpen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txHash])

  const methods = useForm<CollectNftForm>({
    mode: "all",
  })

  const amount = useWatch({
    control: methods.control,
    name: "amount",
  })

  return (
    <CollectNftContext.Provider
      value={{
        roleId,
        rolePlatformId,
        guildPlatform,
        chain,
        nftAddress,
        alreadyCollected,
        isLegacy,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>

      <TransactionStatusModal
        title="Collect NFT"
        successTitle="Success"
        successText={`Successfully collected NFT${amount > 1 ? "s" : ""}!`}
        successLinkComponent={<OpenseaLink />}
        errorComponent={
          <Text mb={4}>{`Couldn't collect NFT${amount > 1 ? "s" : ""}`}</Text>
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
                amount > 1 ? (
                  <HStack>
                    <Text as="span">{name}</Text>
                    <Text
                      as="span"
                      colorScheme="gray"
                      fontWeight="semibold"
                    >{` x${amount}`}</Text>
                  </HStack>
                ) : (
                  name
                )
              }
            />
          </>
        }
        successComponent={
          <>
            <Text fontWeight="bold" mb="2">
              {`Your new asset${amount > 1 ? "s" : ""}:`}
            </Text>
            <RewardDisplay
              icon={
                <RewardIcon
                  guildPlatform={guildPlatform}
                  rolePlatformId={rolePlatformId}
                />
              }
              label={
                amount > 1 ? (
                  <HStack>
                    <Text as="span">{name}</Text>
                    <Text
                      as="span"
                      colorScheme="gray"
                      fontWeight="semibold"
                    >{` x${amount}`}</Text>
                  </HStack>
                ) : (
                  name
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
}: PropsWithChildren<Omit<Props, "alreadyCollected" | "isLegacy">>) => (
  <TransactionStatusProvider>
    <CollectNftProvider {...props}>{children}</CollectNftProvider>
  </TransactionStatusProvider>
)

const useCollectNftContext = () => useContext(CollectNftContext)

export { CollectNftProviderWrapper as CollectNftProvider, useCollectNftContext }
