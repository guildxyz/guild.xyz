import { Link } from "@chakra-ui/next-js"
import { HStack, Text } from "@chakra-ui/react"
import { Icon, Img } from "@chakra-ui/react"
import { ArrowSquareOut } from "@phosphor-icons/react"
import {
  TransactionStatusProvider,
  useTransactionStatusContext,
} from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusContext"
import TransactionStatusModal from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal"
import { RewardIcon } from "components/[guild]/RoleCard/components/Reward"
import { RewardDisplay } from "components/[guild]/RoleCard/components/RewardDisplay"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useEffect,
} from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { GuildPlatform } from "types"
import { openseaBaseUrl } from "utils/guildCheckout/constants"
import { useChainId } from "wagmi"
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

const CollectNftContext = createContext<Props>({} as Props)

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
        ? nftBalance >= mintableAmountPerUser ||
          (maxSupply > 0 ? totalSupply >= maxSupply : false)
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

const OpenseaLink = (): ReactNode => {
  const chainId = useChainId()
  const { nftAddress } = useCollectNftContext()
  const baseUrl = openseaBaseUrl[Chains[chainId]]

  if (!baseUrl) return null
  return (
    <Text mb={6} colorScheme="gray">
      <Link isExternal href={`${baseUrl}/${nftAddress}`}>
        <Img src={"/requirementLogos/opensea.svg"} boxSize={"1em"} mr="1.5" />
        View on OpenSea
        <Icon ml={1.5} as={ArrowSquareOut} />
      </Link>
    </Text>
  )
}

export { CollectNftProviderWrapper as CollectNftProvider, useCollectNftContext }
