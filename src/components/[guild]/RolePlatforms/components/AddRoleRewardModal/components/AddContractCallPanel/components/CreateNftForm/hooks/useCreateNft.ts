import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { Chains } from "connectors"
import useContract from "hooks/useContract"
import pinFileToIPFS from "hooks/usePinata/utils/pinataUpload"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useState } from "react"
import GUILD_REWARD_NFT_FACTORY_ABI from "static/abis/guildRewardNFTFactory.json"
import { GuildPlatform, PlatformType } from "types"
import processWalletError from "utils/processWalletError"
import { ContractCallSupportedChain, CreateNftFormType } from "../CreateNftForm"

const guildRewardBFTFactoryAddresses: Record<ContractCallSupportedChain, string> = {
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

const contractCallArgsToSign: Record<ContractCallFunction, string[]> = {
  [ContractCallFunction.SIMPLE_CLAIM]: [],
}

export type CreateNFTResponse = Omit<GuildPlatform, "id" | "platformGuildName">

const useCreateNft = (onSuccess: (newGuildPlatform: CreateNFTResponse) => void) => {
  const { chainId, account } = useWeb3React()

  const { id: guildId } = useGuild()

  const [loadingText, setLoadingText] = useState<string>()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const guildRewardNFTFactoryContract = useContract(
    guildRewardBFTFactoryAddresses[Chains[chainId]],
    GUILD_REWARD_NFT_FACTORY_ABI,
    true
  )

  const createNft = async (data: CreateNftFormType): Promise<CreateNFTResponse> => {
    // For testing
    // const tempCreatedContractAddress = "0xf597e31fdf9e5cf2082db863f0845bf6a1c8a817"
    // return {
    //   platformId: PlatformType.CONTRACT_CALL,
    //   platformName: "CONTRACT_CALL",
    //   platformGuildId: `${guildId}-${tempCreatedContractAddress}-${Date.now()}`,
    //   platformGuildData: {
    //     chain: data.chain,
    //     contractAddress: tempCreatedContractAddress,
    //     function: ContractCallFunction.SIMPLE_CLAIM,
    //     argsToSign: contractCallArgsToSign[ContractCallFunction.SIMPLE_CLAIM],
    //     description: data.richTextDescription,
    //   },
    // }

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
    // guildId, name, symbol, cid, tokenOwner, tokenTreasury, tokenFee
    const contractCallParams = [
      guildId,
      name,
      symbol,
      metadataCID,
      account,
      tokenTreasury,
      price,
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

      if (!processedCallStaticError) {
        // TODO: switch-case for custom errors here?
        return Promise.reject(callStaticError.errorName)
      }

      return Promise.reject(processedCallStaticError)
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
      platformId: PlatformType.CONTRACT_CALL,
      platformName: "CONTRACT_CALL",
      platformGuildId: `${guildId}-${createdContractAddress}-${Date.now()}`,
      platformGuildData: {
        chain: data.chain,
        contractAddress: createdContractAddress,
        function: ContractCallFunction.SIMPLE_CLAIM,
        argsToSign: contractCallArgsToSign[ContractCallFunction.SIMPLE_CLAIM],
        description: data.richTextDescription,
      },
    }
  }

  return {
    ...useSubmit(createNft, {
      onSuccess: (createdContractCallReward) => {
        setLoadingText(null)

        toast({
          status: "info",
          title: "Deployed NFT contract",
        })

        onSuccess(createdContractCallReward)
      },
      onError: (error) => {
        setLoadingText(null)
        console.log("useCreateNft error", error)
        showErrorToast(error?.message ?? error)
      },
    }),
    loadingText,
  }
}

export default useCreateNft
