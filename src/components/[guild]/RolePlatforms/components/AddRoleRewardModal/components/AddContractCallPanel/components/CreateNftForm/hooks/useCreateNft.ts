import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { NFTDetails } from "components/[guild]/collect/hooks/useNftDetails"
import { Chains, RPC } from "connectors"
import useContract from "hooks/useContract"
import pinFileToIPFS from "hooks/usePinata/utils/pinataUpload"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useState } from "react"
import GUILD_REWARD_NFT_FACTORY_ABI from "static/abis/guildRewardNFTFactory.json"
import { mutate } from "swr"
import { GuildPlatform, PlatformGuildData, PlatformType } from "types"
import processWalletError from "utils/processWalletError"
import { ContractCallSupportedChain, CreateNftFormType } from "../CreateNftForm"

export const GUILD_REWARD_NFT_FACTORY_ADDRESSES: Record<
  ContractCallSupportedChain,
  string
> = {
  ETHEREUM: "0x6ee2dd02fbfb71f518827042b6adca242f1ba0b2",
  BASE_MAINNET: "0x4205e56a69a0130a9e0828d45d0c84e45340a196",
  POLYGON: "0xc1c23618110277ffe6d529816eb23de42b24cc33",
  POLYGON_MUMBAI: "0xf14249947c6de788c61f8ac5db0495ee2663ec1b",
}

type NftMetadata = {
  name: string
  description?: string
  image: string
  attributes: { trait_type: string; value: string }[] // TODO: maybe add display_type too?
}

export enum ContractCallFunction {
  SIMPLE_CLAIM = "function claim(address payToken, address receiver, bytes calldata signature) payable",
}

export const CONTRACT_CALL_ARGS_TO_SIGN: Record<ContractCallFunction, string[]> = {
  [ContractCallFunction.SIMPLE_CLAIM]: [],
}

export type CreateNFTResponse = {
  // returning the submitted form too, so we can easily populate the SWR cache with the NFT details (e.g. image, name, etc.)
  formData: CreateNftFormType
  guildPlatform: Omit<GuildPlatform, "id" | "platformGuildName">
}

const useCreateNft = (
  onSuccess: (newGuildPlatform: CreateNFTResponse["guildPlatform"]) => void
) => {
  const { chainId, account } = useWeb3React()

  const [loadingText, setLoadingText] = useState<string>()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const guildRewardNFTFactoryContract = useContract(
    GUILD_REWARD_NFT_FACTORY_ADDRESSES[Chains[chainId]],
    GUILD_REWARD_NFT_FACTORY_ABI,
    true
  )

  const createNft = async (data: CreateNftFormType): Promise<CreateNFTResponse> => {
    setLoadingText("Uploading image")

    const { IpfsHash: imageCID } = await pinFileToIPFS({
      data: [data.image],
    })

    setLoadingText("Uploading metadata")

    const image = `ipfs://${imageCID}`

    const metadata: NftMetadata = {
      name: data.name,
      description: data.description,
      image,
      attributes:
        data.attributes?.map((attr) => ({
          trait_type: attr.name,
          value: attr.value,
        })) ?? [],
    }

    const metadataJSON = JSON.stringify(metadata)

    const { IpfsHash: metadataCID } = await pinFileToIPFS({
      data: [metadataJSON],
      fileNames: ["metadata.json"],
    })

    setLoadingText("Deploying contract")

    const { name, symbol, tokenTreasury, price } = data
    const trimmedName = name.trim()
    const trimmedSymbol = symbol.trim()
    // name, symbol, cid, tokenOwner, tokenTreasury, tokenFee
    const contractCallParams = [
      trimmedName,
      trimmedSymbol,
      metadataCID,
      account,
      tokenTreasury,
      parseUnits(
        price?.toString() ?? "0",
        RPC[Chains[chainId]]?.nativeCurrency?.decimals ?? 18
      ),
    ]

    try {
      await guildRewardNFTFactoryContract?.callStatic.deployBasicNFT(
        ...contractCallParams
      )
    } catch (callStaticError) {
      let processedCallStaticError: string

      if (callStaticError.error) {
        const walletError = processWalletError(callStaticError.error)
        processedCallStaticError = walletError.title
      }

      return Promise.reject(
        processedCallStaticError ?? callStaticError.errorName ?? callStaticError
      )
    }

    const tx = await guildRewardNFTFactoryContract.deployBasicNFT(
      ...contractCallParams
    )
    const txResponse = await tx.wait()

    const rewardNFTDeployedEvent = txResponse?.events.find(
      (event) => event.event === "RewardNFTDeployed"
    )

    if (!rewardNFTDeployedEvent)
      return Promise.reject("Couldn't find RewardNFTDeployed event")

    const createdContractAddress =
      rewardNFTDeployedEvent.args.tokenAddress.toLowerCase()

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
          symbol: trimmedSymbol,
          image: `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${imageCID}`,
          description: data.richTextDescription,
        },
      },
    }
  }

  return {
    ...useSubmit(createNft, {
      onSuccess: (response) => {
        setLoadingText(null)

        toast({
          status: "success",
          title: "Successfully deployed NFT contract",
        })

        const { chain, contractAddress, name, image } = response.guildPlatform
          .platformGuildData as PlatformGuildData["CONTRACT_CALL"]

        mutate<NFTDetails>(
          ["nftDetails", chain, contractAddress],
          {
            creator: account.toLowerCase(),
            name,
            totalCollectors: 0,
            totalCollectorsToday: 0,
            standard: "ERC-721", // TODO: we should use a dynamic value here
            image,
            description: response.formData.description,
            fee: parseUnits(
              response.formData.price.toString() ?? "0",
              RPC[response.formData.chain]?.nativeCurrency?.decimals ?? 18
            ),
          },
          {
            revalidate: false,
          }
        )

        onSuccess(response.guildPlatform)
      },
      onError: (error) => {
        setLoadingText(null)

        console.error("useCreateNft error", error)

        const prettyError =
          error?.code === "ACTION_REJECTED"
            ? "User rejected the transaction"
            : error?.message ?? error
        showErrorToast(prettyError)
      },
    }),
    loadingText,
  }
}

export default useCreateNft
