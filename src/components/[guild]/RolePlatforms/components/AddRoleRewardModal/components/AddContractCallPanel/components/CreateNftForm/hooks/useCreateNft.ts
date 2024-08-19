import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { datetimeLocalToIsoString } from "components/[guild]/RolePlatforms/components/EditRewardAvailabilityModal/components/StartEndTimeForm"
import { guildNftRewardMetadataSchema } from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { env } from "env"
import pinFileToIPFS from "hooks/usePinata/utils/pinataUpload"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { NFTDetailsAPIResponse } from "pages/api/nft/[chain]/[address]"
import { useState } from "react"
import guildRewardNFTFacotryAbi from "static/abis/guildRewardNFTFactory"
import { mutate } from "swr"
import { GuildPlatformWithOptionalId, PlatformType } from "types"
import getEventsFromViemTxReceipt from "utils/getEventsFromViemTxReceipt"
import processViemContractError from "utils/processViemContractError"
import { TransactionReceipt, WriteContractParameters, parseUnits } from "viem"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { CHAIN_CONFIG, Chain, Chains } from "wagmiConfig/chains"
import { CreateNftFormType } from "../components/NftDataForm"

export const GUILD_REWARD_NFT_FACTORY_ADDRESSES = {
  ETHEREUM: "0x6ee2dd02fbfb71f518827042b6adca242f1ba0b2",
  BASE_MAINNET: "0x4205e56a69a0130a9e0828d45d0c84e45340a196",
  OPTIMISM: "0xe6e6b676f94a6207882ac92b6014a391766fa96e",
  BSC: "0xa445e7d3af54867d14467b44d5487352403d1e59",
  CRONOS: "0x6c2c223b84724c4b8fd41ae0142c2369dfa7e319",
  POLYGON: "0xc1c23618110277ffe6d529816eb23de42b24cc33",
  MANTLE: "0x326f14942f8899406e3224bd63E9f250D275a52e",
  ZKSYNC_ERA: "0x2a1eaf11a9753a871b15e2865d8a47cf17dd9450",
  LINEA: "0x326f14942f8899406e3224bd63E9f250D275a52e",
  CYBER: "0x097E05f7a194a30A482CC9616460498980bE79d3",
  ARBITRUM: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  SCROLL: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  TAIKO: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  BLAST_MAINNET: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  X1: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  CORE_DAO: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  METIS: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  NEON_EVM: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  POLYGON_ZKEVM: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  ZETACHAIN: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  MINT: "0x097E05f7a194a30A482CC9616460498980bE79d3",
  MODE: "0x097E05f7a194a30A482CC9616460498980bE79d3",
  AVALANCHE: "0x13ec6b98362e43add08f7cc4f6befd02fa52ee01",
  LISK: "0x13ec6b98362e43add08f7cc4f6befd02fa52ee01",
  SEPOLIA: "0xa9e8e62266d449b766d305075248790bdd46facb",
} as const satisfies Partial<Record<Chain, `0x${string}`>>

export const CONTRACT_CALL_SUPPORTED_CHAINS = Object.keys(
  GUILD_REWARD_NFT_FACTORY_ADDRESSES
) as (keyof typeof GUILD_REWARD_NFT_FACTORY_ADDRESSES)[]
export type ContractCallSupportedChain =
  (typeof CONTRACT_CALL_SUPPORTED_CHAINS)[number]

export enum ContractCallFunction {
  // Kept the old one too, we can use it to determine if we need to show the old or the new UI for the availability-related features
  DEPRECATED_SIMPLE_CLAIM = "function claim(address payToken, address receiver, bytes calldata signature) payable",
  SIMPLE_CLAIM = "function claim(uint256 amount, address receiver, uint256 userId, uint256 signedAt, bytes calldata signature) payable",
}

export const CONTRACT_CALL_ARGS_TO_SIGN: Record<ContractCallFunction, string[]> = {
  [ContractCallFunction.DEPRECATED_SIMPLE_CLAIM]: [],
  [ContractCallFunction.SIMPLE_CLAIM]: ["uint256"],
}

export type CreateNFTResponse = {
  // returning the submitted form too, so we can easily populate the SWR cache with the NFT details (e.g. image, name, etc.)
  formData: CreateNftFormType
  guildPlatform: Omit<GuildPlatformWithOptionalId, "platformGuildName">
  rolePlatform: {
    startTime?: string
    endTime?: string
  }
}

export const generateGuildRewardNFTMetadata = (
  data: Pick<CreateNftFormType, "name" | "description" | "image" | "attributes">
) => {
  const image = data.image?.replace(env.NEXT_PUBLIC_IPFS_GATEWAY, "ipfs://")

  return guildNftRewardMetadataSchema.parse({
    name: data.name,
    description: data.description,
    image,
    attributes:
      data.attributes?.map((attr) => ({
        trait_type: attr.name,
        value: attr.value,
      })) ?? [],
  })
}

const useCreateNft = (
  onSuccess: (reward: Omit<CreateNFTResponse, "formData">) => void
) => {
  const { urlName } = useGuild()
  const { captureEvent } = usePostHogContext()
  const postHogOptions = { guild: urlName }

  const { address, chainId } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [loadingText, setLoadingText] = useState<string>()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const createNft = async (data: CreateNftFormType): Promise<CreateNFTResponse> => {
    setLoadingText("Uploading metadata")

    const metadata = generateGuildRewardNFTMetadata(data)

    const metadataJSON = JSON.stringify(metadata)

    const { IpfsHash: metadataCID } = await pinFileToIPFS({
      data: [metadataJSON],
      fileNames: ["metadata.json"],
    })

    setLoadingText("Deploying contract")

    const { name, tokenTreasury, price } = data
    const trimmedName = name.trim()

    // { string name; string symbol; string cid; address tokenOwner; address payable treasury; uint256 tokenFee; bool soulbound; uint256 mintableAmountPerUser; }
    const contractCallParams = [
      {
        name: trimmedName,
        symbol: "",
        cid: metadataCID,
        tokenOwner: address,
        treasury: tokenTreasury,
        tokenFee: parseUnits(
          price.toString(),
          CHAIN_CONFIG[Chains[chainId]].nativeCurrency.decimals
        ),
        maxSupply: BigInt(data.maxSupply),
        mintableAmountPerUser: BigInt(data.mintableAmountPerUser),
        soulbound: data.soulbound === "true",
      },
    ] as const satisfies WriteContractParameters<
      typeof guildRewardNFTFacotryAbi,
      "deployConfigurableNFT"
    >["args"]

    const { request } = await publicClient.simulateContract({
      abi: guildRewardNFTFacotryAbi,
      address: GUILD_REWARD_NFT_FACTORY_ADDRESSES[Chains[chainId]],
      functionName: "deployConfigurableNFT",
      args: contractCallParams,
    })

    const hash = await walletClient.writeContract({
      ...request,
    })

    const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt(
      { hash }
    )

    const events = getEventsFromViemTxReceipt(guildRewardNFTFacotryAbi, receipt)

    const rewardNFTDeployedEvent: {
      eventName: "RewardNFTDeployed"
      args: {
        deployer: `0x${string}`
        tokenAddress: `0x${string}`
      }
    } = events.find((event) => event.eventName === "RewardNFTDeployed")

    if (!rewardNFTDeployedEvent)
      return Promise.reject("Couldn't find RewardNFTDeployed event")

    const createdContractAddress =
      rewardNFTDeployedEvent.args.tokenAddress.toLowerCase() as `0x${string}`

    return {
      formData: data,
      guildPlatform: {
        platformId: PlatformType.CONTRACT_CALL,
        platformName: "CONTRACT_CALL",
        platformGuildId: `${data.chain}-${createdContractAddress}-${Date.now()}`,
        platformGuildData: {
          chain: data.chain,
          contractAddress: createdContractAddress,
          function: ContractCallFunction.SIMPLE_CLAIM,
          argsToSign: CONTRACT_CALL_ARGS_TO_SIGN[ContractCallFunction.SIMPLE_CLAIM],
          name: trimmedName,
          imageUrl: data.image,
          description: data.description,
        },
      },
      rolePlatform: {
        startTime: datetimeLocalToIsoString(data.startTime),
        endTime: datetimeLocalToIsoString(data.endTime),
      },
    }
  }

  return {
    ...useSubmit(createNft, {
      onSuccess: ({ guildPlatform, rolePlatform }) => {
        setLoadingText(null)

        toast({
          status: "success",
          title: "Successfully deployed NFT contract",
        })

        const { chain, contractAddress, name } = guildPlatform.platformGuildData

        captureEvent("Successfully created NFT", {
          ...postHogOptions,
          chain,
          contractAddress,
        })

        mutate<NFTDetailsAPIResponse>(
          ["nftDetails", chain, contractAddress],
          {
            creator: address.toLowerCase(),
            name,
            standard: "ERC-721", // TODO: we should use a dynamic value here
          },
          {
            revalidate: false,
          }
        )

        onSuccess({
          guildPlatform,
          rolePlatform,
        })
      },
      onError: (error) => {
        setLoadingText(null)

        const prettyError = processViemContractError(error)

        captureEvent("useCreateNft error", {
          ...postHogOptions,
          prettyError,
          error,
        })

        showErrorToast(prettyError)
      },
    }),
    loadingText,
  }
}

export default useCreateNft
